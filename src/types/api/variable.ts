import type { Behaviour } from '@root/types/api/shared';
import type { QueryReference } from '@root/types/api/reference';
export interface CreateVariableBlueprint {
    name: string;
    behaviour: Behaviour;
    groups?: string[] | null;
    metadata?: unknown;
    projectId: string;
    value?: unknown;
    locale: string;
}

export interface CreatedVariable<Value = unknown, Metadata = unknown> {
    id: string;
    projectID: string;
    locale: string;
    shortID: string;
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
export interface GetVariableBlueprint {
    name: string;
    locale?: string;
    projectId: string;
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
    references: QueryReference[];

    createdAt: string;
    updatedAt: string;
}

export interface DeleteVariableBlueprint {
    name: string;
    locale: string;
    projectId: string;
}
