// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/css/authentication/wrapper.module.css';
import { app } from '@lib/http/fetchInstance';
import { tryHttp } from '@lib/http/tryHttp';
import { Button } from '@mantine/core';
interface Props {
    apiKey: string;
    projectId: string;
    onSuccess: () => void;
}
function calcPosition(windowWidth: number, windowHeight: number) {
    const height = window.innerHeight;
    const width = window.innerWidth;

    return {
        left: Math.floor((width - windowWidth) / 2),
        top: Math.floor((height - windowHeight) / 2),
    };
}
export default function Authentication({ apiKey, projectId, onSuccess }: Props) {
    const width = 480;
    const height = 480;
    const { top, left } = calcPosition(width, height);

    return (
        <div className={styles.root}>
            <div className={styles.button}>
                <Button
                    onClick={async () => {
                        tryHttp(app(), 'post', '/auth/api-auth-session', null, {
                            'X-CREATIF-API-KEY': apiKey,
                            'X-CREATIF-PROJECT-ID': projectId,
                        }).then(({ result }) => {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            const openedWindow = window.open(
                                `http://localhost:3000/auth/api/${result}?apiKey=${apiKey}&projectId=${projectId}`,
                                import.meta.env.VITE_FRONTEND_HOST,
                                `left=${left},top=${top},width=${width},height=${height}`,
                            );
                            if (openedWindow) {
                                const messageInterval = setInterval(() => {
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    openedWindow.postMessage('poll', import.meta.env.VITE_FRONTEND_HOST);
                                }, 100);

                                let messageReceived = false;
                                window.addEventListener(
                                    'message',
                                    (event) => {
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        if (event.origin !== import.meta.env.VITE_FRONTEND_HOST) return;
                                        if (messageReceived) return;
                                        messageReceived = true;
                                        clearInterval(messageInterval);

                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        onSuccess();
                                        openedWindow.close();
                                    },
                                    true,
                                );

                                const removeListenerInterval = setInterval(() => {
                                    if (openedWindow.closed) {
                                        window.removeEventListener(
                                            'message',
                                            (event) => {
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore
                                                if (event.origin !== import.meta.env.VITE_FRONTEND_HOST) return;
                                                if (messageReceived) return;
                                                messageReceived = true;
                                                clearInterval(messageInterval);

                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore
                                                onSuccess();
                                                openedWindow.close();
                                            },
                                            true,
                                        );

                                        clearInterval(removeListenerInterval);
                                        clearInterval(messageInterval);
                                    }
                                }, 100);
                            }
                        });
                    }}
                    variant="light"
                    size="xl">
                    Authenticate
                </Button>
            </div>
        </div>
    );
}
