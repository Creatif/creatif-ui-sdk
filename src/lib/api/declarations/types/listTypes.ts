import type { Behaviour, PaginationBlueprint } from '@lib/api/declarations/types/sharedTypes';
export interface CreateListBlueprint {
    name: string;
    locale?: string;
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
    locale?: string;
}

export interface QueriedListItem<Value, Metadata> {
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
export interface PaginatedVariableResult<Value, Metadata> {
    id: string;
    name: string;
    shortId: string;
    behaviour: Behaviour;
    locale: string;
    groups?: string[];
    value: Value;
    metadata: Metadata;
}
export interface PaginationResult<Value, Metadata> {
    total: number;
    data: PaginatedVariableResult<Value, Metadata>[];
}
export interface AppendToListBlueprint<Value = unknown, Metadata = unknown> {
    name: string;
    variables: AppendingVariableBlueprint<Value, Metadata>[];
}
export interface UpdateListItemBlueprint {
    name: string;
    itemID: string;
    variable: UpdateListItemVariableBlueprint;
}

export interface UpdateListItemVariableBlueprint {
    name: string;
    behaviour: Behaviour;
    groups: string[];
    locale?: string;
    metadata: unknown;
    value: unknown;
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
export interface AppendedListResult {
    id: string;
    projectID: string;
    name: string;
    locale: string;
    createdAt: string;
    updatedAt: string;
}
export interface ListingPagination extends PaginationBlueprint {
    name: string;
    locale?: string;
}
export interface DeleteListItemBlueprint {
    name?: string;
    id?: string;
    shortId?: string;
    itemId?: string;
    itemShortId?: string;
    locale?: string;
}
