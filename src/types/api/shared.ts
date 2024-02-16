export type Behaviour = 'modifiable' | 'readonly';
export type PaginationDirection = 'asc' | 'desc';
export interface PaginationBlueprint {
    page?: number;
    limit?: number;
    groups?: string[];
    orderBy?: string;
    direction?: PaginationDirection;
}

export interface GetGroupsBlueprint {
    structureType: string;
    structureId: string;
    projectId: string;
    itemId: string;
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
