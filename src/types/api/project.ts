import type { StructureType } from '@root/types/shell/shell';
import type { ProjectMetadata } from '@lib/api/project/types/ProjectMetadata';

export interface CreateProjectBlueprint {
    name: string;
}

export interface GetStructureMetadataBlueprint {
    projectId: string;
    config: { name: string; type: StructureType }[];
}

export interface StructureMetadata {
    metadata: ProjectMetadata;
    diff: {
        lists: { id: string; name: string; shortId: string }[];
        maps: { id: string; name: string; shortId: string }[];
    };
    structures: { id: string; name: string; shortId: string; structureType: StructureType }[];
}

export interface Project {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}