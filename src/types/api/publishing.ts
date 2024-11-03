import type { StructureType } from '@root/types/shell/shell';

export interface PublishBlueprint {
    projectId: string;
    name: string;
}

export interface UpdatePublishedBlueprint {
    projectId: string;
    name: string;
}

export interface RemoveVersionBlueprint {
    id: string;
    projectId: string;
}

export interface TruncateStructureBlueprint {
    type: StructureType;
    id: string;
    projectId: string;
}
