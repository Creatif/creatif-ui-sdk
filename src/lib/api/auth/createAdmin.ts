import { app } from '@lib/http/fetchInstance';
import { throwIfHttpFails, tryHttp } from '@lib/http/tryHttp';
import type { AdminUserCreate } from '@root/types/api/auth';

export default function createAdmin(blueprint: AdminUserCreate) {
    return throwIfHttpFails(() =>
        tryHttp(app(), 'put', '/auth/admin/create', {
            name: blueprint.name,
            lastName: blueprint.lastName,
            email: blueprint.email,
            password: blueprint.password,
        }),
    );
}
