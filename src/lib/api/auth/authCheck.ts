import {app} from '@lib/http/axios';
import {tryPost} from '@lib/http/tryPost';
export default function authCheck() {
	return tryPost(app(), '/auth/api-check', null);
}