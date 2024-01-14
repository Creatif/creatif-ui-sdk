import type { Behaviour } from '@root/types/api/shared';

export interface CreateMapBlueprint {
    name: string;
    projectId: string;
}

export interface GetMapBlueprint {
    name: string;
    projectId: string;
}

export interface AppMap {
    id: string;
    name: string;
    projectId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreatedMapVariable {
    id: string;
    name: string;
    shortId: string;
    locale: string;
}

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
    groups: string[];
    value: unknown;
    locale: string;
    metadata: unknown;
}

export interface Reference {
    structureName: string;
    structureType: string;
    structureId: string;
}

export interface AddToMapBlueprint {
    name: string;
    projectId: string;
    variable: AddToMapVariable;
    references?: Reference[];
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
    groups?: string[];
    locale?: string;
    metadata?: unknown;
    value?: unknown;
}

export interface UpdateMapVariableBlueprint {
    name: string;
    itemId: string;
    projectId: string;
    fields?: string[];
    values: UpdateMapItemVariableBlueprint;
}

export interface UpdateMapItemResult<Value = unknown, Metadata = unknown> {
    id: string;
    name: string;
    locale: string;
    behaviour: Behaviour;
    groups: string[];
    metadata: Metadata;
    value: Value;
    createdAt: string;
    updatedAt: string;
}
