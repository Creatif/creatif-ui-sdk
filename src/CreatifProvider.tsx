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
        <React.Suspense>
            <LazyLoadedProvider {...props} />
        </React.Suspense>
    );
}
