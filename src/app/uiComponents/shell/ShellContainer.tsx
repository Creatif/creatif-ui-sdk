import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { CreatifApp } from '@root/types/shell/shell';
import { createRuntime } from '@app/systems/runtimeCreator';
import { ShellApp } from '@app/uiComponents/shell/ShellApp';
import { Runtime } from '@app/systems/runtime/Runtime';
import CenteredError from '@app/components/CenteredError';
import { RuntimeDiff } from '@app/uiComponents/shell/RuntimeDiff';
import { validateConfig } from '@app/setupUtil';
import { RuntimeValidationModal } from '@app/uiComponents/shared/RuntimeValidationModal';

interface Props {
    config: CreatifApp;
}

export default function ShellContainer({ config }: Props) {
    const params = useParams();
    const projectId = params.projectId;

    const [validationMessages, setValidationMessages] = useState<string[] | null>([]);
    const [runtimeCreated, setRuntimeCreated] = useState(false);
    const [runtimeFailed, setRuntimeFailed] = useState(false);

    // the app will always use validated config in the background
    // even if the current config is invalid
    const [validatedConfig, setValidatedConfig] = useState<CreatifApp>();

    useEffect(() => {
        setValidationMessages([]);
        const messages = validateConfig(config);

        if (messages.length !== 0) {
            setValidationMessages(messages);
            return;
        }

        setValidationMessages(null);
        setValidatedConfig(config);
    }, [config]);

    useEffect(() => {
        if (!validatedConfig) return;

        if (projectId && !Runtime.instance) {
            createRuntime(
                projectId,
                validatedConfig.items.map((t) => ({ structureName: t.structureName, structureType: t.structureType })),
            ).then((error) => {
                if (error) {
                    setRuntimeFailed(true);
                    return;
                }

                setRuntimeCreated(true);
            });
        }
    }, [projectId, validatedConfig]);

    return (
        <>
            {validationMessages && <RuntimeValidationModal validationMessages={validationMessages} />}
            {validatedConfig && runtimeCreated && projectId && (
                <RuntimeDiff projectId={projectId} config={validatedConfig} />
            )}
            {validatedConfig && runtimeCreated && <ShellApp config={validatedConfig} />}
            {validatedConfig && runtimeFailed && (
                <CenteredError title="Failed to initiate project. Please, try again later" />
            )}
        </>
    );
}
