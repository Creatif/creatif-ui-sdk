export interface MapStructure {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string | null;
}

export interface ListStructure {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string | null;
}

export interface StructurePaginationResult<Value> {
    total: number;
    page: number;
    data: Value[];
}
