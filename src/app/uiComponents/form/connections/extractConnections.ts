import type { StoreApi, UseBoundStore } from 'zustand';
import type { ConnectionStore } from '@app/systems/stores/inputConnectionStore';
import type { InputConnectionItem } from '@root/types/forms/forms';

type Store = UseBoundStore<StoreApi<ConnectionStore>>;

function isObject(value: unknown): value is { [key: string]: unknown } {
    return typeof value === 'object' && !Array.isArray(value);
}

function unpackInputConnection(value: { value: string; label: string }): InputConnectionItem {
    return JSON.parse(value.value);
}

function isInputConnection(value: unknown): value is { label: string; value: string } {
    if (!value) return false;

    try {
        if (isObject(value) && Object.hasOwn(value, 'label') && Object.hasOwn(value, 'value')) {
            if (typeof value.value === 'string') {
                const parsedValue = JSON.parse(value.value);

                return isObject(parsedValue) && Object.hasOwn(parsedValue, 'creatif_special_variable');
            }
        }
    } catch (e) {
        return false;
    }

    return false;
}

function recursiveExtractConnections(store: Store, path: string, value: unknown[]) {
    for (let i = 0; i < value.length; i++) {
        const val = value[i];

        if (isObject(val)) {
            const keys = Object.keys(val);
            for (const key of keys) {
                const currentPath = `${path}.${i}`;
                const possibleConnection = val[key];
                if (isInputConnection(possibleConnection)) {
                    const inputConnectionItem = unpackInputConnection(possibleConnection);

                    if (!inputConnectionItem.creatif_special_variable) {
                        continue;
                    }

                    store.getState().add({
                        variableId: inputConnectionItem.variableId,
                        structureType: inputConnectionItem.structureType,
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
    store.getState().reset();

    for (const [key, val] of Object.entries(value)) {
        if (isInputConnection(val)) {
            const inputConnectionItem = unpackInputConnection(val);

            store.getState().add({
                variableId: inputConnectionItem.variableId,
                structureType: inputConnectionItem.structureType,
                path: key,
            });
        }

        if (Array.isArray(val)) {
            recursiveExtractConnections(store, key, val);
        }
    }
}
