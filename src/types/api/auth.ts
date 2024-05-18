export interface AuthCheckBlueprint {
    apiKey: string;
    projectId: string;
}

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
