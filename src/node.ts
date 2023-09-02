import type { AssignedValue } from '@root/shared';

export type NodeBehaviour = 'readonly' | 'modifiable';
export interface NodeValidation {
    required: boolean;
    length: string;
    exactValue: string;
    exactValues: string;
    isDate: boolean;
}

export interface Node<T> {
    id: string;
    name: string;
    type: string;
    behaviour: NodeBehaviour;
    groups: string[];
    metadata: T | null;
    createdAt: string;
    updatedAt: string;
}
export interface NodeAssignmentBlueprint<T extends AssignedValue> {
    name: string;
    value: T;
}
export interface NodeValue<T> {
    value: T;
}
export type NodeWithValue<T, F> = Node<T> & NodeValue<F>;
export interface NodeRequestBlueprint<T> {
    name: string;
    type: string;
    behaviour: NodeBehaviour;
    groups?: string[];
    metadata?: T | null;
    validation?: NodeValidation | null;
}
export interface BatchRequestBlueprint {
    name: string;
    type: string;
}
export interface BatchResponse {
    nodes: Record<string, NodeWithValue<unknown, unknown>>[];
    maps: Record<string, Record<string, NodeWithValue<unknown, unknown>[]>>;
}
export interface AssignedNodeResponse<T, F> {
    id: string;
    name: string;
    value: T;
    type: string;
    behaviour: NodeBehaviour;
    groups: string[];
    metadata: F;
    createdAt: string;
    updatedAt: string | null;
}
