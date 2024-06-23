import type { Behaviour } from '@root/types/api/shared';
import type { BaseSyntheticEvent } from 'react';

export type Bindings<T> = {
    name: NameBinding<T>;
    locale?: LocaleBinding<T>;
    groups?: GroupBinding<T>;
    behaviour?: BehaviourBinding<T>;
};

export type BindedValues = {
    name: string | undefined;
    locale: string;
    groups: string[] | null;
    behaviour: Behaviour;
};

export type NameBinding<T> = (values: T) => string;
export type BehaviourBinding<T> = (values: T) => Behaviour;
export type LocaleBinding<T> = (values: T) => string;
export type GroupBinding<T> = (values: T) => string[];

export type AfterSaveFn<T> = (result: unknown, e: BaseSyntheticEvent | undefined) => void;

export type BeforeSaveReturnType = { value: unknown; metadata: unknown };
export type BeforeSaveFn<T> = (values: T, e: BaseSyntheticEvent | undefined) => BeforeSaveReturnType;
