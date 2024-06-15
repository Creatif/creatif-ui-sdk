# Using API SDK

# Installation

````shell
npm install creatif-js-sdk@0.0.4
````

# Setup

After you publish a version in Creatif UI, go to _API_ screen, copy the project ID and initialize
the SDK:

````javascript
import {initialize} from 'creatif-js-sdk';

initialize({
    projectId: <your project ID>
});
````

There is also an optional `baseUrl` argument with which you can set your own production base URL. `baseUrl`
defaults to `http://localhost:3002` for local development. The base url *must* be in this format:

````javascript
import {initialize} from 'creatif-js-sdk';

initialize({
    projectId: <your project ID>,
    baseUrl: 'https://mydomain.com'
});
````

# Usage

SDK has eight functions:

- getVersions()
- getListItemById()
- getListItemsByName()
- getMapItemByName()
- getMapItemById()
- paginateMapItems()
- paginateListItems()

Provided examples will be in Typescript. If you are using vanilla JS, the usage is the same only without the types.

Every function returns a `Result` type which is a generic

````ts
interface Result<Response> {
    result?: Response;
    error?: CreatifError;
}
````

````ts
export interface CreatifError {
    call: ErrorCalls;
    messages: Record<string, string>;
    status: number;
}
````

The API will never throw an error. The `Result` type contains the error, if any and you should check if an
error exists. If you are using a third-party library that expects an error to be thrown (such as react-query),
you must throw it yourself.

All the function have an optional `versionName` property with which you can specify the version name to use.
If omitted, production enabled version will be used.

## getVersions()

Returns an array of versions.

Signature:

````ts
function getVersions(): Promise<Result<Version[]>>
````

````ts
export interface Version {
    id: string;
    name: string;

    projectId: string;
    isProductionVersion: boolean;

    createdAt: string;
    updatedAt: string | null;
}
````

### Usage

````ts
import {initialize, getVersions} from 'creatif-js-sdk';

getVersions().then(({result, error}) => {
    
})
````

## getListItemById()

Returns a single list item.

Signature:

````ts
function getListItemById<Value>(blueprint: GetListItemByID): Promise<Result<ListItem<Value>>>
````

````ts
export interface ListItem<Value> {
    structureId: string;
    structureShortId: string;
    structureName: string;

    itemName: string;
    itemId: string;
    itemShortId: string;
    projectId: string;
    locale: string;
    index: number;
    groups: string[];
    behaviour: Behaviour;
    value: Value | null;
    connections: ConnectionItem<Value>[];

    createdAt: string;
    updatedAt: string | null;
}
````

Request blueprint:

````ts
interface GetListItemByID {
    id: string;
    options?: Options;
    versionName?: string;
}
````

```ts
interface Options {
    valueOnly?: boolean;
}
```

When provided, `valueOnly` will return only the value of the structure entry.

### Usage

````ts
import {initialize, getListItemById} from 'creatif-js-sdk';

getListItemById({
    id: '<list item id>',
}).then(({result, error}) => {
    
})
````

## getMapItemById()

Returns a single map item.

Signature:

````ts
function getMapItemById<Value>(blueprint: GetMapItemByID): Promise<Result<ListItem<Value>>>
````

````ts
export interface MapItem<Value> {
    structureId: string;
    structureShortId: string;
    structureName: string;

    itemName: string;
    itemId: string;
    itemShortId: string;
    projectId: string;
    locale: string;
    index: number;
    groups: string[];
    behaviour: Behaviour;
    value: Value | null;
    connections: ConnectionItem<Value>[];

    createdAt: string;
    updatedAt: string | null;
}
````

Request blueprint:

````ts
interface GetMapItemByID {
    id: string;
    options?: Options;
    versionName?: string;
}
````

```ts
interface Options {
    valueOnly?: boolean;
}
```

When provided, `valueOnly` will return only the value of the structure entry.

### Usage

````ts
import {initialize, getListItemById} from 'creatif-js-sdk';

getListItemById({
    id: '<list item id>',
}).then(({result, error}) => {
    
})
````

## getListItemsByName()

Returns an array of items.

Signature:

````ts
function getListItemsByName<Value>(blueprint: GetListItemsByName): Promise<Result<ListItem<Value>[]>>
````

Request blueprint:

````ts
export interface GetListItemsByName {
    structureName: string;
    name: string;
    locale: string;
    options?: Options;
    versionName?: string;
}
````

```ts
interface Options {
    valueOnly?: boolean;
}
```

When provided, `valueOnly` will return only the value of the structure entry.

### Usage

````ts
import {initialize, getListItemsByName} from 'creatif-js-sdk';

getListItemsByName({
    id: '<list item id>',
}).then(({result, error}) => {

})
````

## getMapItemByName()

Returns a single map item.

Signature:

````ts
function getMapItemByName<Value>(blueprint: GetMapItemByName): Promise<Result<MapItem<Value>>>
````

Request blueprint:

````ts
interface GetMapItemByName {
    versionName?: string;
    structureName: string;
    name: string;
    locale: string;
    options?: Options;
}
````

```ts
interface Options {
    valueOnly?: boolean;
}
```

When provided, `valueOnly` will return only the value of the structure entry.

### Usage

````ts
import {initialize, getMapItemByName} from 'creatif-js-sdk';

getMapItemByName({
    id: '<list item id>',
}).then(({result, error}) => {

})
````

# Pagination

Two function for pagination are `paginateListItems` and `paginateMapItems`. They are essentially the same and
only have a different name. Request parameters for one of them, you can use in both.

Request signature for `paginateMapItems` is

````ts
interface PaginateMapItems {
    structureName: string;
    page: number;
    versionName?: string;
    search?: string;
    orderBy?: OrderBy;
    orderDirection?: OrderDirection;
    locales?: string[];
    groups?: string[];
    options?: Options;
}
````

and for a list

````ts
export interface PaginateListItems {
    structureName: string;
    page: number;
    versionName?: string;
    search?: string;
    orderBy?: OrderBy;
    orderDirection?: OrderDirection;
    locales?: string[];
    groups?: string[];
    options?: Options;
}
````

The only required parameters are `structureName` and `page`.

### Usage

````ts
import {initialize, paginateMapItems} from 'creatif-js-sdk';

getMapItemByName({
    structureName: '<your structure name>',
    page: 1,
}).then(({result, error}) => {
    
})
````

Usage for `paginateListItems` is the same.
