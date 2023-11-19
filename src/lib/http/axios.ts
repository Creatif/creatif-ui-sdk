import { composeBaseUrl } from '@lib/http/composeBaseUrl';
import { Routes } from '@lib/http/routes';
import axios from 'axios';
import type { AxiosInstance } from 'axios';

let declarationsInstance: AxiosInstance | undefined;
let appInstance: AxiosInstance | undefined;
export const declarations = () => {
	if (!declarationsInstance) {
		declarationsInstance = axios.create({
			baseURL: `${composeBaseUrl()}${Routes.DECLARATIONS}`,
			withCredentials: true,
		});
	}

	return declarationsInstance;
};
export const app = () => {
	if (!appInstance) {
		appInstance = axios.create({
			baseURL: `${composeBaseUrl()}${Routes.APP}`,
			withCredentials: true,
		});
	}

	return appInstance;
};
