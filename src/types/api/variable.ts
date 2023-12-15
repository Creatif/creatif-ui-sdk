import type { Behaviour } from '@root/types/api/shared';
export interface CreateVariableBlueprint {
    name: string;
    behaviour: Behaviour;
    groups?: string[] | null;
    metadata?: unknown;
    value?: unknown;
    locale?: string;
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
    locale?: string;
    fields: string[];
    values: UpdateableVariableValuesBlueprint<Value, Metadata>;
}
export interface UpdateableVariableValuesBlueprint<Value, Metadata> {
    name?: string;
    behaviour?: Behaviour;
    value?: Value;
    metadata?: Metadata;
    groups?: string[];
}
export interface GetVariableBlueprint {
    name: string;
    locale?: string;
}
