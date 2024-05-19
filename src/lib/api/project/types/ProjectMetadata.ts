export type Structure = {
    name: string;
    id: string;
    shortId: string;
};

export interface ProjectMetadata {
    id: string;
    name: string;
    state: string;
    maps: Structure[];
    lists: Structure[];
}
