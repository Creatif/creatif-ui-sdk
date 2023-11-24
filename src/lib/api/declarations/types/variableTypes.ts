import type { Behaviour } from '@lib/api/declarations/types/sharedTypes';

export interface CreateVariableBlueprint {
  name: string;
  behaviour: Behaviour;
  groups?: string[] | null;
  metadata?: unknown;
  value?: unknown;
  locale?: string;
}
