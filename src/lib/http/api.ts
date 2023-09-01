import type { AxiosInstance } from 'axios';

class api {
	async put<Body, Data>(instance: AxiosInstance, path: string, body: Body) {
		return await instance.put<Data>(path, body);
	}
	async post<Body, Data>(instance: AxiosInstance, path: string, body: Body) {
		return await instance.post<Data>(path, body);
	}
	async get<Data>(instance: AxiosInstance, path: string) {
		return await instance.get<Data>(path);
	}
}

export const Api = new api();
