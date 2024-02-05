export interface AddGroupsBlueprint {
    groups: string[];
    projectId: string;
}

export interface GetGroupsBlueprint {
    projectId: string;
}

export type Groups = string[];