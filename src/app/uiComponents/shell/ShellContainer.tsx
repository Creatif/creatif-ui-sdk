import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { CreatifApp } from '@root/types/shell/shell';
import { createRuntime } from '@app/systems/runtimeCreator';
import { ShellApp } from '@app/uiComponents/shell/ShellApp';
import UIError from '@app/components/UIError';
import { Runtime } from '@app/systems/runtime/Runtime';

interface Props {
    options: CreatifApp;
}

export default function ShellContainer({ options }: Props) {
    const params = useParams();
    const projectId = params.projectId;

    const [runtimeCreated, setRuntimeCreated] = useState(false);
    const [runtimeFailed, setRuntimeFailed] = useState(false);

    useEffect(() => {
        if (projectId && !Runtime.instance) {
            createRuntime(
                projectId,
                options.items.map((t) => ({ name: t.structureName, type: t.structureType })),
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
            {runtimeCreated && <ShellApp options={options} />}
            {runtimeFailed && <UIError title="Failed to initiate project. Please, try again later" />}
        </>
    );
}
