// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shell/css/root.module.css';
import Navigation from '@app/uiComponents/shell/Navigation';
import Header from '@app/uiComponents/shell/Header';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import React from 'react';
import type { CreatifApp } from '@root/types/shell/shell';
import { Container } from '@mantine/core';

interface Props {
    app: CreatifApp;
}

export function Dashboard({ app }: Props) {
    return (
        <Container fluid m={0} p={0}>
            <div className={styles.root}>
                {app && <Navigation navItems={app.items} logo={app.logo} />}

                <div>
                    <Header />

                    <div className={styles.content}>{<Outlet />}</div>
                </div>
            </div>
        </Container>
    );
}
