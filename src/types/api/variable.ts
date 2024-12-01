import type { Behaviour } from '@root/types/api/shared';
import type { QueryConnection } from '@root/types/api/connections';
export interface CreateVariableBlueprint {
    name: string;
    behaviour?: Behaviour;
    groups?: string[] | null;
    metadata?: unknown;
    projectId: string;
    value?: unknown;
    locale?: string;
}

export interface CreatedVariable<Value = unknown, Metadata = unknown> {
    id: string;
    projectId: string;
    locale: string;
    shortId: string;
    name: string;
    groups: string[];
    behaviour: Behaviour;
    metadata: Value;
    value: Metadata;

    createdAt: string;
    updatedAt: string;
}
export interface UpdateVariableBlueprint<Value = unknown, Metadata = unknown> {
    name: string;
    projectId: string;
    locale: string;
    fields: string[];
    values: UpdateableVariableValuesBlueprint<Value, Metadata>;
}
export interface UpdateableVariableValuesBlueprint<Value = unknown, Metadata = unknown> {
    name?: string;
    behaviour?: Behaviour;
    value?: Value;
    metadata?: Metadata;
    groups?: string[];
    locale?: string;
}

export interface GetVariableResponse<Value = unknown, Metadata = unknown> {
    id: string;
    name: string;
    shortID: string;
    behaviour: Behaviour;
    groups?: string[];
    metadata?: Value;
    value?: Metadata;
    locale: string;
    connections: QueryConnection[];

    createdAt: string;
    updatedAt: string;
}

export interface DeleteVariableBlueprint {
    name: string;
    locale: string;
    projectId: string;
}
