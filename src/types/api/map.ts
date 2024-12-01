import type { Behaviour, ChildStructure, ConnectionViewType } from '@root/types/api/shared';
import type { QueryConnection } from '@root/types/api/connections';
import type { StructureType } from '@root/types/shell/shell';
import type { Group } from '@root/types/api/groups';

export interface CreatedMap {
    id: string;
    shortId: string;
    projectId: string;
    name: string;
    variables: [];
}

export interface AddToMapVariable {
    name: string;
    behaviour: Behaviour;
    groups: string[] | null;
    value: unknown;
    locale: string;
    metadata: unknown;
}

export interface Connection {
    name: string;
    structureName: string;
    structureType: StructureType;
    variableId: string;
}

export interface AddToMapBlueprint {
    name: string;
    projectId: string;
    variable: AddToMapVariable;
    connections?: Connection[];
    imagePaths: string[];
}

export interface PaginateMapBlueprint {
    name: string;
    projectId: string;
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

export interface QueryMapVariableBlueprint {
    structureId: string;
    itemId: string;
    projectId: string;
    connectionViewType: ConnectionViewType;
}

export interface QueriedMapItem<Value = unknown, Metadata = unknown> {
    id: string;
    locale: string;
    shortId: string;
    name: string;
    behaviour: Behaviour;
    groups: string[];
    metadata: Metadata;
    value: Value;
    connections: QueryConnection[];
    childStructures: ChildStructure[];
    createdAt: string;
    updatedAt: string;
}

export interface DeleteMapItemBlueprint {
    name: string;
    itemId: string;
    projectId: string;
}

export interface UpdateMapItemVariableBlueprint {
    name?: string;
    behaviour?: Behaviour;
    groups?: string[] | null;
    locale?: string;
    metadata?: unknown;
    value?: unknown;
}

export interface UpdateMapVariableConnectionBlueprint {
    name: string;
    structureName: string;
    structureType: string;
    variableId: string;
}

export interface UpdateMapVariableBlueprint {
    name: string;
    itemId: string;
    projectId: string;
    fields?: string[];
    values: UpdateMapItemVariableBlueprint;
    connections: UpdateMapVariableConnectionBlueprint[];
    imagePaths: string[];
}

export interface UpdateMapItemResult<Value = unknown> {
    id: string;
    name: string;
    locale: string;
    behaviour: Behaviour;
    groups: Group[];
    value: Value;
    createdAt: string;
    updatedAt: string;
}
