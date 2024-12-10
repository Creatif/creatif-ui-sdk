import type { UpdateListItemResult } from '@root/types/api/list';
import type { UpdateMapItemResult } from '@root/types/api/map';
import type { StructureType } from '@root/types/shell/shell';

export type Behaviour = 'modifiable' | 'readonly';
export type PaginationDirection = 'asc' | 'desc';

export interface GetGroupsBlueprint {
    structureType: string;
    structureId: string;
    projectId: string;
    itemId: string;
}

export type ConnectionViewType = 'value' | 'variable' | 'connection';

export interface ChildStructure {
    structureName: string;
    structureType: StructureType;
    structureId: string;
}

export interface PaginatedVariableResult<Value = unknown, Metadata = unknown> {
    id: string;
    name: string;
    shortId: string;
    index: number;
    behaviour: Behaviour;
    locale: string;
    groups?: string[];
    value: Value;
    metadata: Metadata;

    createdAt: string;
    updatedAt: string;
}
export interface PaginationResult<Value, Metadata> {
    total: number;
    page: number;
    data: PaginatedVariableResult<Value, Metadata>[];
}

export type UnifiedStructure = UpdateListItemResult & UpdateMapItemResult;
