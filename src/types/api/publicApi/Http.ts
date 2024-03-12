export type ErrorCalls =
    | 'getListItemById'
    | 'getListItemsByName'
    | 'getMapItemById'
    | 'getMapItemByName'
    | 'getVersions'
    | 'paginateListItems'
    | 'paginateMapItems';

export interface CreatifError {
    call: ErrorCalls;
    messages: Record<string, string>;
    status: number;
}

export interface Result<Response> {
    result?: Response;
    error?: CreatifError;
}

export type TryHttpResult<T> = { result: T; status: number };