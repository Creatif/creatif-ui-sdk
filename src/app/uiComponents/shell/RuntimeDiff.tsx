import { useEffect } from 'react';
import type { CreatifApp } from '@root/types/shell/shell';
import { Runtime } from '@app/systems/runtime/Runtime';

interface Props {
    projectId: string;
    config: CreatifApp;
}

export function RuntimeDiff({ projectId, config }: Props) {
    // project config is the source of truth for updating runtime, not the config in store.
    useEffect(() => {
        const storedConfig = Runtime.instance.configCache.getCachedConfig();
        const configItems = config.items.map((t) => ({
            structureName: t.structureName,
            structureType: t.structureType,
        }));

        if (storedConfig.length !== configItems.length) {
            Runtime.instance.configCache.updateConfig(configItems);
            location.reload();
            return;
        }

        for (const currentConfigItem of configItems) {
            let found = false;
            for (const storedConfigItem of storedConfig) {
                if (
                    storedConfigItem.structureName === currentConfigItem.structureName &&
                    storedConfigItem.structureType === currentConfigItem.structureType
                ) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                Runtime.instance.configCache.updateConfig(configItems);
                location.reload();
                return;
            }
        }
    }, [projectId, config]);

    return null;
}
