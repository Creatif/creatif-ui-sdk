import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { Behaviour } from '@root/types/api/shared';
import type { StructureType } from '@root/types/shell/shell';

interface Reference {
    structureType: StructureType;
    structureId: string;
}
export interface SpecialFieldsStore {
    locale: string;
    groups: string[];
    behaviour: Behaviour;
    references: Reference[];

    setLocale: (l: string) => void;
    setBehaviour: (l: Behaviour) => void;
    setGroups: (g: string[]) => void;
    addReference: (reference: Reference) => void;
}

const store: Record<string, UseBoundStore<StoreApi<SpecialFieldsStore>>> = {};
export function createSpecialFields() {
    return create<SpecialFieldsStore>((set) => ({
        locale: 'eng',
        behaviour: 'modifiable',
        groups: [],
        references: [],
        setLocale: (l: string) => set(() => ({ locale: l })),
        setBehaviour: (l: Behaviour) => set(() => ({ behaviour: l })),
        setGroups: (l: string[]) => set(() => ({ groups: l })),
        addReference: (l: Reference) => set((values) => ({ references: [...values.references, l] })),
    }));
}
export function getSpecialFields(structureName: string, locale: string, type: string) {
    const name = `${structureName}_${locale}_${type}`;

    if (!store[name]) throw new Error(`Cannot find store for '${name}'. This is definitely a bug.`);

    return store[name];
}
