import { useRef } from 'react';

export function useWorker(path: string, onMessage: (e: MessageEvent) => void) {
    const uploadWorkerRef = useRef<Worker>(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        new Worker(new URL(`${import.meta.env.VITE_FRONTEND_HOST}/${path}`), {
            type: 'module',
        }),
    );

    return {
        registerWorker() {
            uploadWorkerRef.current.onmessage = (e: MessageEvent) => {
                onMessage(e);
            };
        },
        workerHandler: uploadWorkerRef.current as Worker,
    };
}
