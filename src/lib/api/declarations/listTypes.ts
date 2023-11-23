import type {Behaviour} from '@lib/api/declarations/sharedTypes';
export interface CreateListBlueprint {
  name: string;
  locale?: string;
}
export interface AppendingVariableBlueprint<Value = unknown, Metadata = unknown> {
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
