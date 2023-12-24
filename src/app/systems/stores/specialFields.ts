import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { Behaviour } from '@root/types/api/shared';
export interface SpecialFieldsStore {
    locale: string;
    groups: string[];
    behaviour: Behaviour;
    setLocale: (l: string) => void;
    setBehaviour: (l: Behaviour) => void;
    setGroups: (g: string[]) => void;
}

const store: Record<string, UseBoundStore<StoreApi<SpecialFieldsStore>>> = {};
export function createSpecialFields() {
    return create<SpecialFieldsStore>((set) => ({
        locale: 'eng',
        behaviour: 'modifiable',
        groups: [],
        setLocale: (l: string) => set(() => ({ locale: l })),
        setBehaviour: (l: Behaviour) => set(() => ({ behaviour: l })),
        setGroups: (l: string[]) => set(() => ({ groups: l })),
    }));
}
export function getSpecialFields(structureName: string, locale: string, type: string) {
    const name = `${structureName}_${locale}_${type}`;

    if (!store[name]) throw new Error(`Cannot find store for '${name}'. This is definitely a bug.`);

    return store[name];
}
