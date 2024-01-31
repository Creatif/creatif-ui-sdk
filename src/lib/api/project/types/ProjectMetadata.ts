export type Structure = {
    name: string;
    id: string;
    shortId: string;
};

export interface ProjectMetadata {
    id: string;
    name: string;
    state: string;
    userId: string;
    variables: Record<string, Structure[]>;
    maps: Structure[];
    lists: Structure[];
}
