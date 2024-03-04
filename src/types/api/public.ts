export interface Version {
    id: string;
    name: string;
    projectId: string;
    isProductionVersion: boolean;

    createdAt: string;
    updatedAt: string | null;
}

export interface VersionBlueprint {
    projectId: string;
}
