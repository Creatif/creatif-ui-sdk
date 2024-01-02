import { app } from '@lib/http/fetchInstance';
import { tryHttp } from '@lib/http/tryHttp';
export default function logout() {
    return tryHttp(app(), 'post', '/auth/logout', undefined);
}
