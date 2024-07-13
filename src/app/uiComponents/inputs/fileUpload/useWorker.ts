import { useCallback, useEffect, useState } from 'react';

export function useWorker(path: string, onMessage: (e: MessageEvent) => void) {
    const [uploadWorker, setUploadWorker] = useState<Worker | undefined>();
    const [workerConstructionError, setWorkerConstructionError] = useState<string | undefined>();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const w = new Worker(new URL(`${import.meta.env.VITE_FRONTEND_HOST}/${path}`), {
            type: 'module',
        });

        w.addEventListener('error', (e) => {
            if (e.type === 'error') {
                setWorkerConstructionError(
                    'Unable to construct web worker. This means that a worker in the root directory of the project has been tampered with. Please, revert the workers into its original state and refresh this page.',
                );
            }
        });

        setUploadWorker(w);
    }, []);

    const registerWorker = useCallback(() => {
        if (!uploadWorker) return;
        uploadWorker.onmessage = (e: MessageEvent) => {
            onMessage(e);
        };
    }, [uploadWorker]);

    return {
        registerWorker: registerWorker,
        workerConstructionError,
        workerHandler: uploadWorker,
    };
}
