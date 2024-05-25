import type { Behaviour, ConnectionItem, Options, OrderBy, OrderDirection } from '@root/types/api/publicApi/Shared';

export interface GetMapItemByName {
    versionName?: string;
    structureName: string;
    name: string;
    locale: string;
    options?: Options;
}

export interface MapItem<Value> {
    structureId: string;
    structureShortId: string;
    structureName: string;

    itemName: string;
    itemId: string;
    itemShortId: string;
    projectId: string;
    locale: string;
    index: number;
    groups: string[];
    behaviour: Behaviour;
    value: Value | null;
    connections: ConnectionItem<Value>[];

    createdAt: string;
    updatedAt: string | null;
}

export interface GetMapItemByID {
    id: string;
    options?: Options;
    versionName?: string;
}

export interface PaginateMapItems {
    structureName: string;
    versionName?: string;
    page: number;
    search: string;
    orderBy: OrderBy;
    orderDirection: OrderDirection;
    locales: string[];
    groups: string[];
    options?: Options;
}
