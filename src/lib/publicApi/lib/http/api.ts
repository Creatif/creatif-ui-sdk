import { Runtime } from '@lib/publicApi/lib/runtime';

class api {
    async put<Body>(path: string, body: Body, headers: Record<string, string> = {}) {
        return fetch(`${Runtime.instance.baseUrl()}${path}`, {
            method: 'put',
            body: body ? JSON.stringify(body) : null,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            credentials: 'include',
        });
    }

    async post<Body>(path: string, body: Body, headers: Record<string, string> = {}) {
        return fetch(`${Runtime.instance.baseUrl()}${path}`, {
            method: 'POST',
            body: body ? JSON.stringify(body) : null,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            credentials: 'include',
        });
    }

    async get<Body>(path: string, body: Body, headers: Record<string, string> = {}) {
        return fetch(`${Runtime.instance.baseUrl()}${path}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            credentials: 'include',
        });
    }

    async delete<Body>(path: string, body: Body, headers: Record<string, string> = {}) {
        return fetch(`${Runtime.instance.baseUrl()}${path}`, {
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
