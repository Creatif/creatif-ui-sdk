import type { Behaviour, ChildStructure, ConnectionViewType } from '@root/types/api/shared';
import type { QueryConnection } from '@root/types/api/connections';
import type { StructureType } from '@root/types/shell/shell';
import type { Group } from '@root/types/api/groups';
export interface AppendingVariableBlueprint<Value = unknown, Metadata = unknown> {
    name: string;
    behaviour: Behaviour;
    groups?: string[] | null;
    locale?: string;
    value?: Value;
    metadata?: Metadata;
}

export interface QueryListItemByIDBlueprint {
    structureId: string;
    itemId: string;
    projectId: string;
    connectionViewType?: ConnectionViewType;
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
    connections: QueryConnection[];
    childStructures: ChildStructure[];
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
    page: number;
    data: PaginatedVariableResult<Value, Metadata>[];
}

export interface Connection {
    name: string;
    structureType: StructureType;
    variableId: string;
}

export interface AddToListBlueprint<Value = unknown, Metadata = unknown> {
    name: string;
    variable: AppendingVariableBlueprint<Value, Metadata>;
    projectId: string;
    connections: Connection[];
    imagePaths: string[];
}
export interface UpdateListItemBlueprint {
    name: string;
    itemId: string;
    projectId: string;
    fields?: string[];
    values: UpdateListItemVariableBlueprint;
    connections: UpdateMapVariableConnectionBlueprint[];
    imagePaths: string[];
}

export interface UpdateMapVariableConnectionBlueprint {
    name: string;
    structureType: string;
    variableId: string;
}

export interface UpdateListItemVariableBlueprint {
    name?: string;
    behaviour?: Behaviour;
    groups?: string[] | null;
    locale?: string;
    metadata?: unknown;
    value?: unknown;
}

export interface UpdateListItemResult<Value = unknown> {
    id: string;
    name: string;
    locale: string;
    behaviour: Behaviour;
    groups: Group[];
    value: Value;
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
    projectId: string;
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
    orderDirection: string;
}

export interface PaginateListStructureBlueprint {
    projectId: string;
    limit: string | number;
    page: number;
    orderBy?: string;
    direction?: 'desc' | 'asc';
    search: string;
}

export interface PaginateMapStructureBlueprint {
    projectId: string;
    limit: string | number;
    page: number;
    orderBy?: string;
    direction?: 'desc' | 'asc';
    search: string;
}
