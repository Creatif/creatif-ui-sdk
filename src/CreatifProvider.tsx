import { createTheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import React, { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import type { CreatifApp } from '@root/types/shell/shell';
import type { PropsWithChildren } from 'react';
import 'normalize.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@app/css/reset.module.css';
import '@app/css/global.module.css';
import { Setup } from '@root/Setup';
import { BrowserRouter } from 'react-router-dom';

interface Props {
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

export function CreatifProvider({ app }: Props & PropsWithChildren) {
    return (
        <MantineProvider theme={theme}>
            <Notifications limit={5} />

            <QueryClientProvider client={queryClient}>
                <BrowserRouter basename="/">
                    <Setup app={app} />
                </BrowserRouter>
            </QueryClientProvider>
        </MantineProvider>
    );
}
