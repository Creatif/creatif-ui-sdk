import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { CreatifApp } from '@root/types/shell/shell';
import { createRuntime } from '@app/systems/runtimeCreator';
import { ShellApp } from '@app/uiComponents/shell/ShellApp';
import { Runtime } from '@app/systems/runtime/Runtime';
import CenteredError from '@app/components/CenteredError';
import { RuntimeDiff } from '@app/uiComponents/shell/RuntimeDiff';
import { RuntimeConfigFailModal } from '@app/uiComponents/shared/RuntimeConfigFailModal';

interface Props {
    options: CreatifApp;
}

export default function ShellContainer({ options }: Props) {
    const params = useParams();
    const projectId = params.projectId;

    const [runtimeCreated, setRuntimeCreated] = useState(false);
    const [runtimeFailed, setRuntimeFailed] = useState(false);
    const [runtimeUpdateFailed, setRuntimeUpdateFailed] = useState(false);

    useEffect(() => {
        if (projectId && !Runtime.instance) {
            createRuntime(
                projectId,
                options.items.map((t) => ({ structureName: t.structureName, structureType: t.structureType })),
            ).then((error) => {
                if (error) {
                    setRuntimeFailed(true);
                    return;
                }

                setRuntimeCreated(true);
            });
        }
    }, [projectId]);

    return (
        <>
            {runtimeCreated && projectId && (
                <RuntimeDiff
                    onRuntimeUpdateFail={() => {
                        setRuntimeUpdateFailed(true);
                    }}
                    projectId={projectId}
                    config={options}
                />
            )}
            {runtimeUpdateFailed && <RuntimeConfigFailModal />}
            {runtimeCreated && <ShellApp config={options} />}
            {runtimeFailed && <CenteredError title="Failed to initiate project. Please, try again later" />}
        </>
    );
}
