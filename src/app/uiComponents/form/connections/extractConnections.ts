import type { StoreApi, UseBoundStore } from 'zustand';
import type { ConnectionStore } from '@app/systems/stores/inputConnectionStore';
import type { InputConnectionItem } from '@root/types/forms/forms';

type Store = UseBoundStore<StoreApi<ConnectionStore>>;

function isObject(value: unknown): value is { [key: string]: unknown } {
    return typeof value === 'object' && !Array.isArray(value);
}

function isInputConnectionItem(value: unknown): value is InputConnectionItem {
    if (!value) return false;

    return isObject(value) && Object.hasOwn(value, 'creatif_special_variable');
}

function recursiveExtractConnections(store: Store, path: string, value: unknown[]) {
    for (let i = 0; i < value.length; i++) {
        const val = value[i];

        if (isObject(val)) {
            const keys = Object.keys(val);
            for (const key of keys) {
                const currentPath = `${path}.${i}`;
                const possibleConnection = val[key];
                if (isInputConnectionItem(possibleConnection)) {
                    if (!possibleConnection.creatif_special_variable) {
                        continue;
                    }

                    store.getState().add({
                        variableId: possibleConnection.variableId,
                        structureType: possibleConnection.structureType,
                        path: `${currentPath}.${key}`,
                    });
                }

                if (Array.isArray(possibleConnection)) {
                    recursiveExtractConnections(store, currentPath, possibleConnection);
                }
            }
        }
    }
}

export function extractConnections(store: Store, value: { [key: string]: unknown }) {
    for (const [key, val] of Object.entries(value)) {
        if (isInputConnectionItem(val)) {
            store.getState().add({
                variableId: val.variableId,
                structureType: val.structureType,
                path: key,
            });
        }

        if (Array.isArray(val)) {
            recursiveExtractConnections(store, key, val);
        }
    }
}
