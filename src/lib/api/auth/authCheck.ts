import { app } from '@lib/http/axios';
import { tryPost } from '@lib/http/tryPost';
export default function authCheck(apiKey: string, projectId: string) {
	return tryPost(app(), '/auth/api-check', null, {
		'X-CREATIF-API-KEY': apiKey,
		'X-CREATIF-PROJECT-ID': projectId,
	});
}
