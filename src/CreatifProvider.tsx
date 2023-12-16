import Authentication from '@app/components/authentication/Authentication';
import { Initialize } from '@app/initialize';
import authCheck from '@lib/api/auth/authCheck';
import { getProjectMetadata } from '@lib/api/project/getProjectMetadata';
import { getSupportedLocales } from '@lib/api/project/getSupportedLocales';
import CurrentLocaleStorage from '@lib/storage/currentLocaleStorage';
import StructureStorage from '@lib/storage/structureStorage';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import React, { useCallback, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import type { CreatifApp } from '@root/types/shell/shell';
import type { PropsWithChildren } from 'react';
import 'normalize.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@app/css/reset.module.css';
import '@app/css/global.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/order
import animations from '@app/css/animations.module.css';
import Shell from '@app/uiComponents/shell/Shell';

interface Props {
    apiKey: string;
    projectId: string;
    app: CreatifApp;
}

const theme = createTheme({
    primaryColor: 'indigo-primary',
    colors: {
        'indigo-primary': [
            '#f3f0ff',
            '#e5dbff',
            '#d0bfff',
            '#b197fc',
            '#9775fa',
            '#845ef7',
            '#7950f2',
            '#7048e8',
            '#6741d9',
            '#5f3dc4',
        ],
    },
    fontFamily: 'Barlow, sans-serif',
    fontFamilyMonospace: 'Monaco, Courier, monospace',
    headings: { fontFamily: 'Barlow, sans-serif' },
});

const queryClient = new QueryClient();
export function CreatifProvider({ apiKey, projectId, app }: Props & PropsWithChildren) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [checkedAuth, setIsAuthCheck] = useState<'idle' | 'success' | 'fail'>('idle');

    const init = useCallback(async () => {
        const { result } = await getProjectMetadata({ apiKey: apiKey, projectId: projectId });

        if (result) {
            getSupportedLocales().then(({ result: locales, error }) => {
                if (error) {
                    queryClient.setQueryData('supported_locales', 'failed');
                }

                if (locales) {
                    queryClient.setQueryData('supported_locales', locales);
                }

                CurrentLocaleStorage.init('eng');
                Initialize.init(apiKey, projectId, CurrentLocaleStorage.instance.getLocale());
                StructureStorage.init(result);
                setIsLoggedIn(true);
            });
        }
    }, []);

    useEffect(() => {
        authCheck({ apiKey: apiKey, projectId: projectId }).then(async (res) => {
            if (res.error) {
                setIsAuthCheck('fail');
                return;
            }

            init();
        });
    }, []);

    return (
        <MantineProvider theme={theme}>
            {isLoggedIn && <Notifications limit={5} />}
            {isLoggedIn && (
                <>
                    <QueryClientProvider client={queryClient}>
                        <div className={animations.initialAnimation}>
                            <Shell options={app} />
                        </div>
                    </QueryClientProvider>
                </>
            )}

            {!isLoggedIn && checkedAuth === 'fail' && (
                <Authentication apiKey={apiKey} projectId={projectId} onSuccess={init} />
            )}
        </MantineProvider>
    );
}
