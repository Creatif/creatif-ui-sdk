import { useEffect } from 'react';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import type { CreatifApp } from '@root/types/shell/shell';

interface Props {
    projectId: string;
    config: CreatifApp;
}

export function RuntimeDiff({ projectId, config }: Props) {
    const store = getProjectMetadataStore();

    useEffect(() => {
        const structures = store.getState().structureItems;
        const configItems = config.items.map((t) => ({ name: t.structureName, type: t.structureType }));

        if (structures.length !== configItems.length) {
            //location.reload();
        }
    }, [projectId]);

    return null;
}