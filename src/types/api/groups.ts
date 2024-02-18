export interface SingleGroupBlueprint {
    name: string;
    id: string;
    action: 'create' | 'remove' | 'void';
    type: 'new' | 'current';
}

export interface AddGroupsBlueprint {
    groups: SingleGroupBlueprint[];
    projectId: string;
}

export interface GetGroupsBlueprint {
    projectId: string;
}

export type Group = {
    id: string;
    name: string;
};
