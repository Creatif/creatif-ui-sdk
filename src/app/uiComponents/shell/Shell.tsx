import { createOptions } from '@app/systems/stores/options';
import { ListList as StructureListListing } from '@app/uiComponents/lists/ListList';
import { ListList as StructuredMapsListing } from '@app/uiComponents/maps/ListList';
import { ListList as VariableListListing } from '@app/uiComponents/variables/ListList';
import Header from '@app/uiComponents/shell/Header';
import Navigation from '@app/uiComponents/shell/Navigation';
import { Container } from '@mantine/core';
import React, { useRef } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/root.module.css';
import type { Shell, CreatifApp } from '@root/types/shell/shell';
import Item from '@app/uiComponents/show/variable/Item';
interface Props {
    options: CreatifApp;
}
export default function Shell({ options }: Props) {
    const storeCreatedRef = useRef(false);
    if (!storeCreatedRef.current) {
        for (const option of options.items) {
            const { structureName, structureType, routePath } = option;

            createOptions({
                structureName: structureName,
                path: routePath,
                type: structureType,
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
                                <Route path={`${item.routePath}/create`} element={item.createComponent} />
                                {item.structureType === 'list' && (
                                    <>
                                        <Route
                                            path={`${item.routePath}/update/:structureId/:itemId`}
                                            element={item.updateComponent}
                                        />
                                        <Route
                                            path={`${item.routePath}`}
                                            element={<StructureListListing listName={item.structureName} />}
                                        />
                                    </>
                                )}

                                {item.structureType === 'map' && (
                                    <>
                                        <Route
                                            path={`${item.routePath}/update/:structureId/:itemId`}
                                            element={item.updateComponent}
                                        />
                                        <Route
                                            path={`${item.routePath}`}
                                            element={<StructuredMapsListing mapName={item.structureName} />}
                                        />
                                    </>
                                )}

                                {item.structureType === 'variable' && (
                                    <>
                                        <Route
                                            path={`${item.routePath}/update/:structureId/:variableLocale`}
                                            element={item.updateComponent}
                                        />
                                        <Route
                                            path={`${item.routePath}`}
                                            element={<VariableListListing name={item.structureName} />}
                                        />

                                        <Route path={'variable/show/:variableName/:locale'} element={<Item />} />
                                    </>
                                )}
                            </React.Fragment>
                        ))}
                    </Route>
                </Routes>
            </BrowserRouter>
        </Container>
    );
}
