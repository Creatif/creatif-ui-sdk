import type { StoreApi, UseBoundStore } from 'zustand';
import type { ReferencesStore } from '@app/systems/stores/inputReferencesStore';

export default function removeReferencesFromForm(
    obj: { [key: string]: unknown },
    referenceStore: UseBoundStore<StoreApi<ReferencesStore>>,
) {
    const formKeys = Object.keys(obj);
    const referenceKeys = referenceStore.getState().keys();

    for (const key of formKeys) {
        for (const refKey of referenceKeys) {
            if (refKey === key) {
                delete obj[key];
            }
        }
    }
}
