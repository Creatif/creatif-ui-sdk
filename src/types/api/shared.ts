export type Behaviour = 'modifiable' | 'readonly';
export type PaginationDirection = 'asc' | 'desc';
export interface PaginationBlueprint {
    page?: number;
    limit?: number;
    groups?: string[];
    orderBy?: string;
    direction?: PaginationDirection;
}
