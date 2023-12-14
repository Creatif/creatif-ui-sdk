import { createOptions } from '@app/systems/stores/options';
import ListList from '@app/uiComponents/listing/ListList';
import Header from '@app/uiComponents/shell/Header';
import Navigation from '@app/uiComponents/shell/Navigation';
import { Container } from '@mantine/core';
import React, { useRef } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/root.module.css';
import type { AppShellItems, CreatifApp } from '@app/uiComponents/shell/types/AppShellItems';
interface Props {
    options: CreatifApp;
}
export default function Shell({ options }: Props) {
    const storeCreatedRef = useRef(false);
    if (!storeCreatedRef.current) {
        for (const option of options.items) {
            const { name, type } = option.structure;
            const { path } = option.menu;

            createOptions({
                structureName: name,
                path: path,
                type: type,
            });
        }

        storeCreatedRef.current = true;
    }

    return (
        <Container fluid m={0} p={0}>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div className={styles.root}>
                                {options && <Navigation navItems={options.items} logo={options.logo} />}

                                <div>
                                    <Header />

                                    <div className={styles.content}>{<Outlet />}</div>
                                </div>
                            </div>
                        }>
                        {options.items.map((item, i) => (
                            <React.Fragment key={i}>
                                <Route path={`${item.menu.path}/create`} element={item.create.component} />
                                <Route
                                    path={`${item.menu.path}/update/:structureId/:itemId`}
                                    element={item.update.component}
                                />
                                {item.structure.type === 'list' && (
                                    <Route
                                        path={`${item.menu.path}`}
                                        element={<ListList listName={item.structure.name} />}
                                    />
                                )}

                                {item.structure.type === 'variable' && (
                                    <Route path={`${item.menu.path}`} element={<div>Variable listing</div>} />
                                )}
                            </React.Fragment>
                        ))}
                    </Route>
                </Routes>
            </BrowserRouter>
        </Container>
    );
}
