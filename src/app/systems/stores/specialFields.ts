import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { Behaviour } from '@root/types/api/shared';

export interface SpecialFieldsStore {
    locale: string;
    groups: string[];
    behaviour: Behaviour;
    fieldsUsed: string[];
    addField: (field: string) => void;
    removeField: (field: string) => void;

    getDuplicateFields: () => string[];
    setLocale: (l: string) => void;
    setBehaviour: (l: Behaviour) => void;
    setGroups: (g: string[]) => void;
}

const store: Record<string, UseBoundStore<StoreApi<SpecialFieldsStore>>> = {};
export function createSpecialFields() {
    return create<SpecialFieldsStore>((set, get) => ({
        fieldsUsed: [],
        locale: 'eng',
        behaviour: 'modifiable',
        groups: [],
        getDuplicateFields: () => {
            const current = get();
            const fieldsUsed = current.fieldsUsed;
            const duplicates: string[] = [];

            const visited: string[] = [];
            for (const item of fieldsUsed) {
                if (visited.includes(item)) {
                    duplicates.push(item);
                }

                visited.push(item);
            }

            return duplicates;
        },
        addField: (field: string) => set((current) => ({...current, fieldsUsed: [...current.fieldsUsed, field]})),
        removeField: (field: string) => set((current) => {
           const currentFields = current.fieldsUsed;
           if (currentFields.includes(field)) {
               const idx = currentFields.indexOf(field);
               if (idx !== -1) {
                   currentFields.splice(idx, 1);
                   return {...current, fieldsUsed: [...currentFields]};
               }
           }
           
           return current;
        }),
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
