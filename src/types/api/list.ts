import type { Behaviour } from '@root/types/api/shared';
import type { QueryReference } from '@root/types/api/reference';
import type { StructureType } from '@root/types/shell/shell';
export interface CreateListBlueprint {
    name: string;
    projectId: string;
}

export interface CreatedList {
    id: string;
    shortId: string;
    name: string;
    locale: string;
    createdAt: string;
    updatedAt: string;
}
export interface AppendingVariableBlueprint<Value = unknown, Metadata = unknown> {
    name: string;
    behaviour: Behaviour;
    groups?: string[];
    locale?: string;
    value?: Value;
    metadata?: Metadata;
}

export interface QueryListItemByIDBlueprint {
    structureId: string;
    itemId: string;
    projectId: string;
}

export interface QueriedListItem<Value = unknown, Metadata = unknown> {
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

export interface PaginateListBlueprint {
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
export interface PaginatedVariableResult<Value = unknown, Metadata = unknown> {
    id: string;
    name: string;
    shortId: string;
    index: number;
    behaviour: Behaviour;
    locale: string;
    groups?: string[];
    value: Value;
    metadata: Metadata;

    createdAt: string;
    updatedAt: string;
}
export interface PaginationResult<Value, Metadata> {
    total: number;
    data: PaginatedVariableResult<Value, Metadata>[];
}
export interface AppendToListBlueprint<Value = unknown, Metadata = unknown> {
    name: string;
    variables: AppendingVariableBlueprint<Value, Metadata>[];
    projectId: string;
}

export interface Reference {
    name: string;
    structureName: string;
    structureType: StructureType;
    variableId: string;
}

export interface AddToListBlueprint<Value = unknown, Metadata = unknown> {
    name: string;
    variable: AppendingVariableBlueprint<Value, Metadata>;
    projectId: string;
    references: Reference[];
}
export interface UpdateListItemBlueprint {
    name: string;
    itemId: string;
    projectId: string;
    fields?: string[];
    values: UpdateListItemVariableBlueprint;
    references: UpdateMapVariableReferenceBlueprint[];
}

export interface UpdateMapVariableReferenceBlueprint {
    name: string;
    structureName: string;
    structureType: string;
    variableId: string;
}

export interface UpdateListItemVariableBlueprint {
    name?: string;
    behaviour?: Behaviour;
    groups?: string[];
    locale?: string;
    metadata?: unknown;
    value?: unknown;
}

export interface UpdateListItemResult<Value = unknown, Metadata = unknown> {
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
export interface AppendedListResponse {
    id: string;
    projectID: string;
    name: string;
    locale: string;
    createdAt: string;
    updatedAt: string;
}
export interface DeleteListItemBlueprint {
    name?: string;
    id?: string;
    shortId?: string;
    itemId?: string;
    itemShortId?: string;
    locale?: string;
}
export interface DeleteRangeBlueprint {
    name: string;
    projectId: string;
    items: string[];
}

export interface RearrangeBlueprint {
    name: string;
    source: string;
    destination: string;
    projectId: string;
}
