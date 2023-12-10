import type { Behaviour } from '@lib/api/declarations/types/sharedTypes';
import type { BaseSyntheticEvent } from 'react';

export type Bindings<T> = {
    name: NameBinding<T>;
    groups?: GroupBinding<T>;
    behaviour?: BehaviourBinding<T>;
};
export type NameBinding<T> = string | ((values: T) => string);
export type BehaviourBinding<T> = string | ((values: T) => Behaviour);
export type GroupBinding<T> = string | ((values: T) => string | string[]);

export type AfterSaveFn = (result: BeforeSaveReturnType, e: BaseSyntheticEvent | undefined) => void;

export type BeforeSaveReturnType = { value: unknown; metadata: unknown };
export type BeforeSaveFn<T> = (values: T, e: BaseSyntheticEvent | undefined) => BeforeSaveReturnType;
