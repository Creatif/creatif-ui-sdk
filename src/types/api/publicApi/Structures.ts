export interface Structure {
    id: string;
    name: string;
    shortId: string;
    structureType: StructureType;

    createdAt: string;
    updatedAt: string | null;
}

export type StructureType = 'map' | 'list';
