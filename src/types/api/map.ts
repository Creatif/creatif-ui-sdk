import type { Behaviour } from '@root/types/api/shared';
import type { QueryReference } from '@root/types/api/reference';
import type { StructureType } from '@root/types/shell/shell';

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

export interface Reference {
    name: string;
    structureName: string;
    structureType: StructureType;
    variableId: string;
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
    references: QueryReference[];

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

export interface UpdateMapVariableReferenceBlueprint {
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
    references: UpdateMapVariableReferenceBlueprint[];
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
