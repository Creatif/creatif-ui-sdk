export type Behaviour = 'modifiable' | 'readonly';
export type ConnectionType = 'map' | 'list';

export interface Options {
    valueOnly?: boolean;
}

export interface ConnectionItem<Value> {
    structureId: string;
    structureShortId: string;
    structureName: string;
    connectionType: ConnectionType;

    name: string;
    id: string;
    shortId: string;
    projectId: string;
    locale: string;
    index: number;
    groups: string[];
    behaviour: Behaviour;
    value: Value | null;

    createdAt: string;
    updatedAt: string | null;
}

export type OrderBy = 'index' | 'name' | 'created_at' | 'updated_at';
export type OrderDirection = 'desc' | 'asc';
