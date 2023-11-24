import type { Behaviour } from '@lib/api/declarations/types/sharedTypes';
export interface CreateListBlueprint {
  name: string;
  locale?: string;
}
export interface AppendingVariableBlueprint<
  Value = unknown,
  Metadata = unknown,
> {
  name: string;
  behaviour: Behaviour;
  groups?: string[];
  value?: Value;
  metadata?: Metadata;
}

export interface AppendToListBlueprint<Value = unknown, Metadata = unknown> {
  name: string;
  locale?: string;
  variables: AppendingVariableBlueprint<Value, Metadata>[];
}
export interface AppendedListResult {
  id: string;
  projectID: string;
  name: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
}
