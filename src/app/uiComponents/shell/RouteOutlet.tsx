// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shell/css/root.module.css';
import Navigation from '@app/uiComponents/shell/Navigation';
import Header from '@app/uiComponents/shell/Header';
import { Outlet } from 'react-router-dom';
import React from 'react';
import type { CreatifApp } from '@root/types/shell/shell';

interface Props {
    app: CreatifApp;
}

export default function RouteOutlet({ app }: Props) {
    return (
        <div className={styles.root}>
            {app && <Navigation navItems={app.items} logo={app.logo} />}

            <div>
                <Header navItems={app.items} />

                <div className={styles.content}>{<Outlet />}</div>
            </div>
        </div>
    );
}
