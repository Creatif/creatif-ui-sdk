import type { ApiError } from '@lib/http/apiError';

export interface TryResult<T> {
  result?: T;
  status: number;
  error?: ApiError;
}
export type ObjectType = Record<string, unknown>;
export type TextValue = string;
export type BooleanValue = boolean;
export type UploadValue = TextValue | Blob;
export type AssignedValue = ObjectType | TextValue | BooleanValue | UploadValue;

export type NodeType = 'text' | 'file' | 'image' | 'code' | 'json' | 'boolean';
export type Scheme = 'http' | 'https' | '';
