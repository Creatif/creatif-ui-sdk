export interface ProjectMetadataBlueprint {
    apiKey: string;
    projectId: string;
}

export interface AdminUserCreate {
    name: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginBlueprint {
    email: string;
    password: string;
}
