import type { Behaviour, ConnectionItem, OrderBy, OrderDirection } from './Shared';

export interface ListItem<Value> {
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

export interface GetListItemByID {
    id: string;
}

export interface PaginateListItems {
    structureName: string;
    page: number;
    search: string;
    orderBy: OrderBy;
    orderDirection: OrderDirection;
    locales: string[];
    groups: string[];
}
