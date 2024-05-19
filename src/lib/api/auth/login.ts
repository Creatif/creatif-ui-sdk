import { app } from '@lib/http/fetchInstance';
import { throwIfHttpFails, tryHttp } from '@lib/http/tryHttp';
import type { LoginBlueprint } from '@root/types/api/auth';

export default function login(blueprint: LoginBlueprint) {
    return throwIfHttpFails(() =>
        tryHttp(app(), 'post', '/auth/login', {
            email: blueprint.email,
            password: blueprint.password,
        }),
    );
}
