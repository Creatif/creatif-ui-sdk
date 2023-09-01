import { AxiosError } from 'axios';
import {notification} from "antd";

export const defaultMutationArgs = (errorMetadata: HttpErrorMetadata[] = []) => ({
    onError(err: unknown) {
        if (err instanceof AxiosError && err.response) {
            const data = err.response.data as Record<string, string>;

            for (const metadata of errorMetadata) {
                if (data[metadata.key]) {
                    notification.open({
                        id: metadata.key,
                        message: metadata.message,
                        color: 'red',
                        autoClose: 5000,
                    });

                    return;
                }
            }
        }

        if (err instanceof AxiosError && err.code === 'ERR_NETWORK') {
            showNotification({
                id: 'networkError',
                message:
                    'A network error occurred. This might be something wrong with our API or there is no internet connection. Please, try again later.',
                color: 'red',
                autoClose: 5000,
            });

            return;
        }

        showNotification({
            id: 'defaultError',
            message: 'Something wrong happened. Please, try again later.',
            color: 'red',
            autoClose: 5000,
        });

        return;
    },
    onSuccess: () => {
        showNotification({
            id: 'defaultSuccess',
            message: 'Operation was successful.',
            color: 'greed',
            autoClose: 5000,
        });
    },
});
