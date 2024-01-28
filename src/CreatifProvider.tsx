import type { CreatifApp } from '@root/types/shell/shell';
import React from 'react';
import Loading from '@app/components/Loading';

interface Props {
    apiKey: string;
    projectId: string;
    app: CreatifApp;
}

const LazyLoadedProvider = React.lazy(() => import('@root/Provider'));

export function CreatifProvider(props: Props) {
    return (
        <React.Suspense
            fallback={
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '100vh',
                    }}>
                    <div
                        style={{
                            fontFamily: "'Barlow', sans-serif",
                            fontWeight: 'bolder',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: '#5f3dc4',
                        }}>
                        LOADING YOUR APPLICATION
                    </div>
                </div>
            }>
            <LazyLoadedProvider {...props} />
        </React.Suspense>
    );
}
