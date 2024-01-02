export interface ProjectMetadata {
    id: string;
    name: string;
    state: string;
    userId: string;
    variables: Record<string, string[]> | null;
    maps: string[];
    lists: string[];
}
