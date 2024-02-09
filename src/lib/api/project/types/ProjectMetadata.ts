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
    variables: Structure[];
    maps: Structure[];
    lists: Structure[];
}
