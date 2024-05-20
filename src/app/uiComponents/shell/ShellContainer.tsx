import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { CreatifApp } from '@root/types/shell/shell';
import { createRuntime } from '@app/systems/runtimeCreator';
import { ShellApp } from '@app/uiComponents/shell/ShellApp';

interface Props {
    options: CreatifApp;
}

export default function ShellContainer({ options }: Props) {
    const params = useParams();

    const [runtimeCreated, setRuntimeCreated] = useState(false);

    useEffect(() => {
        if (params.projectId) {
            createRuntime(
                params.projectId,
                options.items.map((t) => ({ name: t.structureName, type: t.structureType })),
            ).then(() => {
                setRuntimeCreated(true);
            });
        }
    }, [params]);

    return <>{runtimeCreated && <ShellApp options={options} />}</>;
}
