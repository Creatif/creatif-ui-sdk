import logout from '@lib/api/auth/logout';

export class ForbiddenPublisher {
    static async logoutIfRequired(status: number) {
        if (status === 403) {
            await logout();
            location.href = '/';
        }
    }
}
