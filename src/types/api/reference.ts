import type { StructureType } from '@root/types/shell/shell';

interface Reference {
    id: string;
    parentType: string;
    childType: string;

    parentId: string;
    parentShortId: string;

    childId: string;
    childShortId: string;

    createdAt: string;
    updatedAt: string;
}

export interface QueryReference {
    id: string;
    name: string;
    structureType: StructureType;
    structureId: string;
    ownerId: string;
}
