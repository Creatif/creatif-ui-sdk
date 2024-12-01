import type { Behaviour } from '@root/types/api/shared';
import type { StructureType } from '@root/types/shell/shell';

export interface QueryConnection {
    path: string;
    childVariableId: string;
    childStructureType: StructureType;
    parentVariableId: string;
    parentStructureType: StructureType;
    createdAt: string;
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
