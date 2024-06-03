import { useEffect, useState } from 'react';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import type { CreatifApp } from '@root/types/shell/shell';
import { updateRuntime } from '@app/systems/runtimeCreator';
import CurrentConfigCache from '@lib/storage/currentConfigCache';
import { Runtime } from '@app/systems/runtime/Runtime';

interface Props {
    projectId: string;
    config: CreatifApp;
    onRuntimeUpdateFail: () => void;
}

export function RuntimeDiff({ projectId, config, onRuntimeUpdateFail }: Props) {
    // project config is the source of truth for updating runtime, not the config in store.
    useEffect(() => {
        const storedConfig = Runtime.instance.configCache.getCachedConfig();
        const configItems = config.items.map((t) => ({ name: t.structureName, type: t.structureType }));

        if (storedConfig.length !== configItems.length) {
            updateRuntime(projectId, config.items.map(t => ({type: t.structureType, name: t.structureName}))).then(() => {
                // do nothing
            }).catch(() => {
                onRuntimeUpdateFail();
            });

            return;
        }

        for (const currentConfigItem of configItems) {
            let found = false;
            for (const storedConfigItem of storedConfig) {
                if (storedConfigItem.structureName === currentConfigItem.name && storedConfigItem.structureType === currentConfigItem.type) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                updateRuntime(projectId, config.items.map(t => ({type: t.structureType, name: t.structureName}))).then(() => {
                    // do nothing
                }).catch(() => {
                    onRuntimeUpdateFail();
                });

                return;
            }
        }


    }, [projectId]);

    return null;
}
