import type { FetchInstance } from '@lib/http/fetchInstance';

class api {
    async put<Body>(instance: FetchInstance, path: string, body: Body, headers: Record<string, string> = {}) {
        return fetch(`${instance.baseURL}${path}`, {
            method: 'put',
            body: body ? JSON.stringify(body) : null,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            credentials: 'include',
        });
    }
    async post<Body>(instance: FetchInstance, path: string, body: Body, headers: Record<string, string> = {}) {
        return fetch(`${instance.baseURL}${path}`, {
            method: 'POST',
            body: body ? JSON.stringify(body) : null,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            credentials: 'include',
        });
    }
    async get<Body>(instance: FetchInstance, path: string, body: Body, headers: Record<string, string> = {}) {
        console.log(headers);
        return fetch(`${instance.baseURL}${path}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            credentials: 'include',
        });
    }
    async delete<Body>(instance: FetchInstance, path: string, body: Body, headers: Record<string, string> = {}) {
        return fetch(`${instance.baseURL}${path}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            credentials: 'include',
        });
    }
}

export const Api = new api();
