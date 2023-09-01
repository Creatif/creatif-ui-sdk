import { composeBaseUrl } from '@lib/http/composeBaseUrl';
import { Routes } from '@lib/http/routes';
import axios from 'axios';
import type { AxiosInstance } from 'axios';

let declarationsInstance: AxiosInstance | undefined;
let assignmentsInstance: AxiosInstance | undefined;
export const declarations = () => {
	if (!declarationsInstance) {
		declarationsInstance = axios.create({
			baseURL: `${composeBaseUrl()}${Routes.DECLARATIONS}`,
		});
	}

	return declarationsInstance;
};
export const assignments = () => {
	if (!assignmentsInstance) {
		assignmentsInstance = axios.create({
			baseURL: `${composeBaseUrl()}${Routes.ASSIGNMENTS}`,
		});
	}

	return assignmentsInstance;
};
