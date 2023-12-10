import type { NodeBehaviour, NodeType } from '@root/types/types';

export interface NamesOnlyMapNode {
    id: string;
    name: string;
}
export interface CustomMapNode<T, F> {
    id: string;
    name: string;
    type?: NodeType;
    behaviour?: NodeBehaviour;
    groups?: string[];
    metadata?: T | null;
    value?: F | null;
    createdAt?: string;
    updatedAt?: string;
}
export interface Map<T> {
    id: string;
    name: string;
    value: T;
    createdAt: string;
    updatedAt: string | null;
}
export interface MapBlueprint {
    nodes: string[];
    name: string;
}
export interface CreateMapResponse {
    id: string;
    name: string;
    nodes: string[];
}
export interface GetMapResponse<T> {
    id: string;
    name: string;
    nodes: T[];
}
export interface AssignedMapResponse<T = unknown> {
    id: string;
    name: string;
    value: T;
    createdAt: string;
    updatedAt: string | null;
}
