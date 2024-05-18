import Authentication from '@app/components/authentication/Authentication';
import { Credentials } from '@app/credentials';
import authCheck from '@lib/api/auth/authCheck';
import CurrentLocaleStorage from '@lib/storage/currentLocaleStorage';
import { createTheme, MantineProvider } from '@mantine/core';
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
import animations from '@app/css/animations.module.css';
import Shell from '@app/uiComponents/shell/Shell';
import type LocalesCache from '@lib/storage/localesCache';
import FirstTimeSetup from '@app/uiComponents/shell/FirstTimeSetup';
import AuthPage from '@app/uiComponents/shell/AuthPage';
import Banner from '@app/uiComponents/shell/Banner';
import { Runtime } from '@app/runtime/Runtime';
import { validateConfig } from '@app/setupUtil';
import { createSetup } from '@app/setup';
import type { ProjectMetadata } from '@lib/api/project/types/ProjectMetadata';
import { createFirstTimeSetupStore } from '@app/systems/stores/firstTimeSetupStore';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

interface Props {
    apiKey: string;
    projectId: string;
    app: CreatifApp;
}

const queryClient = new QueryClient();

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

export function CreatifProvider({ apiKey, projectId, app }: Props & PropsWithChildren) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [checkedAuth, setIsAuthCheck] = useState<'idle' | 'success' | 'fail'>('idle');
    const [validationMessages, setValidationMessages] = useState<string[]>([]);

    const init = useCallback(async () => {
        const setup = createSetup(apiKey, projectId);
        await setup.run();

        const errors = setup.getErrors();

        if (errors.length !== 0) {
            console.error(errors);
            return;
        }

        const locales = setup.getStorage<LocalesCache>('locales') as LocalesCache;
        const projectMetadata = setup.getStorage<ProjectMetadata>('projectMetadata') as ProjectMetadata;

        Runtime.init(new Runtime(new Credentials(apiKey, projectId), new CurrentLocaleStorage('eng'), locales));

        createFirstTimeSetupStore({
            projectMetadata: projectMetadata,
            configItems: app.items.map((item) => ({
                structureName: item.structureName,
                structureType: item.structureType,
            })),
        });

        setIsLoggedIn(true);
    }, []);

    useEffect(() => {
        const v = validateConfig(app);
        if (v.length !== 0) {
            setIsAuthCheck('fail');
            setValidationMessages(v);

            return;
        }

        authCheck({ apiKey: apiKey, projectId: projectId }).then(async (res) => {
            if (res.error) {
                setIsAuthCheck('fail');
                return;
            }

            init();
        });
    }, [app]);

    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <AuthPage>
                    <Banner />
                    <Authentication />
                </AuthPage>
            ),
        },
        {
            path: '/login',
            element: (
                <AuthPage>
                    <Banner />
                    <div>Login</div>
                </AuthPage>
            ),
        },
    ]);

    return (
        <MantineProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <Notifications limit={5} />
                <RouterProvider router={router} />

                {isLoggedIn && (
                    <FirstTimeSetup>
                        <div className={animations.initialAnimation}>
                            <Shell options={app} />
                        </div>
                    </FirstTimeSetup>
                )}
            </QueryClientProvider>
        </MantineProvider>
    );
}
