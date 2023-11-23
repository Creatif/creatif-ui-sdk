export type CacheResult<T> = { hit: boolean; value: T };
export type FetchState = 'idle' | 'isFetching' | 'isError';
export interface HttpState<T> {
  state: FetchState;
  value: T | undefined;
  isCacheHit: boolean;
  error: Error | undefined;
}
export interface APIError {
  data: Record<string, string>;
}
