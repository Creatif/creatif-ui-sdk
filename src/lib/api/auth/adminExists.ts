import { app } from '@lib/http/fetchInstance';
import { throwIfHttpFails, tryHttp } from '@lib/http/tryHttp';

export default function adminExists() {
    return throwIfHttpFails(() => tryHttp<boolean>(app(), 'get', '/auth/admin/exists', null));
}
