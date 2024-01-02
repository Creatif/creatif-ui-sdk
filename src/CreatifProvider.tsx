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
import animations from '@app/css/animations.module.css';
import Shell from '@app/uiComponents/shell/Shell';
import LocalesCache from '@lib/storage/localesCache';
import FirstTimeSetup from '@app/uiComponents/shell/FirstTimeSetup';
import AuthPage from '@app/uiComponents/shell/AuthPage';
import Banner from '@app/uiComponents/shell/Banner';
import InitialSetup from '@lib/storage/initialSetup';

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

function removePreviousStorageIfExists(currentKey: string, projectId: string) {
    const lsKeys = Object.keys(localStorage);
    const incomingKey = `creatif-${projectId}`;
    // filter out the keys that are not project key
    const possibleAppKeys = lsKeys.filter((item) => new RegExp('creatif-').test(item));
    // if this is a different app key, remove all creatif keys since they will be recreated later
    if (!possibleAppKeys.includes(incomingKey)) {
        console.info('Removing previous app LS keys. They will be recreated.');
        for (const lsKey of lsKeys) {
            if (new RegExp('creatif-').test(lsKey)) {
                localStorage.removeItem(lsKey);
            }
        }
    }
}

async function loadLocalesAndMetadata(apiKey: string, projectId: string, config: CreatifApp): Promise<boolean> {
    const { result: projectMetadata, error } = await getProjectMetadata({ apiKey: apiKey, projectId: projectId });
    if (error) return false;

    removePreviousStorageIfExists(`creatif-${projectId}`, projectId);

    InitialSetup.init({
        lists: (function () {
            const appLists = config.items
                .map((item) => {
                    if (item.structureType === 'list') return item.structureName;
                })
                .filter((item) => item);

            const t: { [item: string]: boolean } = {};
            for (const item of appLists) {
                const metadataLists = projectMetadata?.lists || [];
                if (item && metadataLists.includes(item)) {
                    t[item] = true;
                } else if (item) {
                    t[item] = false;
                }
            }

            return t;
        })(),
        maps: (function () {
            const appLists = config.items
                .map((item) => {
                    if (item.structureType === 'map') return item.structureName;
                })
                .filter((item) => item);

            const t: { [item: string]: boolean } = {};
            for (const item of appLists) {
                const metadataLists = projectMetadata?.maps || [];
                if (item && metadataLists.includes(item)) {
                    t[item] = true;
                } else if (item) {
                    t[item] = false;
                }
            }

            return t;
        })(),
    });

    Initialize.init(apiKey, projectId);
    LocalesCache.init();
    if (!LocalesCache.instance.hasLocales()) {
        const { result: locales } = await getSupportedLocales();
        if (locales) {
            LocalesCache.init(locales);
        }
    }

    CurrentLocaleStorage.init('eng');

    if (projectMetadata) {
        StructureStorage.init(projectMetadata);
    }

    return true;
}

function prepareConfigForFirstTimeSetup(config: CreatifApp) {
    const items = config.items;
    const setup: Record<'lists' | 'maps', string[]> = { lists: [], maps: [] };

    for (const item of items) {
        if (item.structureType === 'list') {
            setup.lists.push(item.structureName);
        }

        if (item.structureType === 'map') {
            setup.maps.push(item.structureName);
        }
    }

    return setup;
}

function validateConfig(app: CreatifApp) {
    const messages = [];
    if (!app) {
        messages.push('App config does not exist. Your application cannot be created without configuration.');
        return messages;
    }

    if (!Array.isArray(app.items)) {
        messages.push("App config does not have the request 'config.items'. It must be an array of of structures.");
        return messages;
    }

    const structures = [];
    for (const item of app.items) {
        if (typeof item.menuText !== 'string' || !item.menuText) {
            messages.push("Config item 'config.item.menuText' is invalid. It must be a string.");
        }

        if (typeof item.routePath !== 'string' || !item.routePath) {
            messages.push("Config item 'config.item.menuPath' is invalid. It must be a string.");
        }

        if (typeof item.structureName !== 'string' || !item.structureName) {
            messages.push("Config item 'config.item.structureName' is invalid. It must be a string.");
        }

        if (typeof item.structureType !== 'string' || !item.structureType) {
            messages.push("Config item 'config.item.structureType' is invalid. It must be a string.");
        }

        structures.push({
            name: item.structureName,
            type: item.structureType,
        });

        if (!item.createComponent) {
            ("Config item 'config.item.createComponent' is invalid. It must be a valid React component.");
        }

        if (!item.updateComponent) {
            ("Config item 'config.item.updateComponent' is invalid. It must be a valid React component.");
        }
    }

    const currentLists = structures.filter((item) => item.type === 'list').map((item) => item.name);

    if (currentLists.length !== Array.from(new Set(currentLists)).length) {
        messages.push(
            `Some of the 'list' type items have duplicate names. Every list must have a unique name. Provided lists are ${currentLists.join(
                ', ',
            )}`,
        );
    }

    const currentMaps = structures.filter((item) => item.type === 'map').map((item) => item.name);

    if (currentMaps.length !== Array.from(new Set(currentMaps)).length) {
        messages.push(
            `Some of the 'list' type items have duplicate names. Every list must have a unique name. Provided lists are ${currentLists.join(
                ', ',
            )}`,
        );
    }

    return messages;
}
export function CreatifProvider({ apiKey, projectId, app }: Props & PropsWithChildren) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [checkedAuth, setIsAuthCheck] = useState<'idle' | 'success' | 'fail'>('idle');
    const [validationMessages, setValidationMessages] = useState<string[]>([]);
    const firstTimeSetup = prepareConfigForFirstTimeSetup(app);

    const init = useCallback(async () => {
        if (!(await loadLocalesAndMetadata(apiKey, projectId, app))) {
            setIsAuthCheck('fail');
            return;
        }

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

    return (
        <MantineProvider theme={theme}>
            {isLoggedIn && <Notifications limit={5} />}
            {isLoggedIn && (
                <>
                    <QueryClientProvider client={queryClient}>
                        <FirstTimeSetup lists={firstTimeSetup.lists} maps={firstTimeSetup.maps}>
                            <div className={animations.initialAnimation}>
                                <Shell options={app} />
                            </div>
                        </FirstTimeSetup>
                    </QueryClientProvider>
                </>
            )}

            {!isLoggedIn && checkedAuth === 'fail' && (
                <AuthPage>
                    <Banner />
                    <Authentication
                        apiKey={apiKey}
                        projectId={projectId}
                        onSuccess={init}
                        validationMessages={validationMessages}
                    />
                </AuthPage>
            )}
        </MantineProvider>
    );
}
