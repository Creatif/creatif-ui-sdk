import type { StructureType } from '@root/types/shell/shell';
import type { Behaviour } from '@root/types/api/shared';

export interface QueryConnection {
    path: string;
    childVariableId: string;
    childStructureType: StructureType;
    parentVariableId: string;
    parentStructureType: StructureType;
    createdAt: string;
}

export interface PaginateConnectionsBlueprint {
    structureId: string;
    parentVariableId: string;
    structureType: StructureType;
    projectId: string;
    search: string;
    limit: string | number;
    groups?: string[];
    orderBy?: string;
    direction?: 'desc' | 'asc';
    behaviour?: Behaviour;
    locales?: string[];
    fields?: string[];
}
