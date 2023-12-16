import { composeBaseUrl } from '@lib/http/composeBaseUrl';
import { Routes } from '@lib/http/routes';

export interface FetchInstance {
    baseURL: string;
}

let declarationsInstance: FetchInstance | undefined;
let appInstance: FetchInstance | undefined;
export const declarations = (): FetchInstance => {
    if (!declarationsInstance) {
        return {
            baseURL: `${composeBaseUrl()}${Routes.DECLARATIONS}`,
        };
    }

    return declarationsInstance;
};
export const app = () => {
    if (!appInstance) {
        return {
            baseURL: `${composeBaseUrl()}${Routes.APP}`,
        };
    }

    return appInstance;
};
