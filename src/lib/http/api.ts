import type { AxiosInstance } from 'axios';

class api {
	async put<Body>(
		instance: AxiosInstance,
		path: string,
		body: Body,
		headers: Record<string, string> = {},
	) {
		return await instance({
			method: 'put',
			url: path,
			data: body,
			headers: headers,
		});
	}
	async post<Body>(
		instance: AxiosInstance,
		path: string,
		body: Body,
		headers: Record<string, string> = {},
	) {
		return await instance({
			method: 'post',
			url: path,
			data: body,
			headers: headers,
		});
	}
	async get(
		instance: AxiosInstance,
		path: string,
		headers: Record<string, string> = {},
	) {
		return await instance({
			method: 'get',
			url: path,
			headers: headers,
		});
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async delete<Body>(instance: AxiosInstance, path: string, body: Body) {
		return await instance.delete(path);
	}
}

export const Api = new api();
