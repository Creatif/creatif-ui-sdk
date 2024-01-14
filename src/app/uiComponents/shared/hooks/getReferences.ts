import type { Reference } from '@root/types/api/map';
import type { ReferenceValue } from '@app/uiComponents/inputs/InputReference';

export default function getReferences(obj: { [key: string]: unknown }): Reference[] {
    const keys = Object.keys(obj);
    const references: Reference[] = [];

    for (const key of keys) {
        if (/_reference/.test(key)) {
            const value: ReferenceValue = obj[key] as ReferenceValue;

            references.push({
                structureName: value.structureName,
                structureType: value.structureType,
                structureId: value.value,
            });
        }
    }

    return references;
}
