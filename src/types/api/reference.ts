import type { StructureType } from '@root/types/shell/shell';
import type { Behaviour } from '@root/types/api/shared';

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
    structureName: string;
    parentType: string;
    childType: string;
    childStructureId: string;
    parentStructureId: string;
    parentId: string;
    childId: string;
}

export interface PaginateReferencesBlueprint {
    projectId: string;
    parentId: string;
    childId: string;
    structureType: string;
    relationshipType: string;
    parentStructureId: string;
    childStructureId: string;
    search: string;
    limit: string | number;
    page: number;
    groups?: string[];
    orderBy?: string;
    direction?: 'desc' | 'asc';
    behaviour?: Behaviour;
    locales?: string[];
    fields?: string[];
}
