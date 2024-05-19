import { app } from '@lib/http/fetchInstance';
import { throwIfHttpFails, tryHttp } from '@lib/http/tryHttp';

export default function hasProjects() {
    return throwIfHttpFails(() => tryHttp(app(), 'get', '/project/exists', null));
}
