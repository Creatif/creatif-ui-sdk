import { createAppConfig, getOptions } from '@app/systems/stores/options';
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
import { Item as VariableShowItem } from '@app/uiComponents/show/variable/Item';
import { Item as ListItemShowItem } from '@app/uiComponents/show/list/Item';
import { Item as MapItemShowItem } from '@app/uiComponents/show/map/Item';
interface Props {
    options: CreatifApp;
}
export default function Shell({ options }: Props) {
    const storeCreatedRef = useRef(false);
    if (!storeCreatedRef.current) {
        for (const option of options.items) {
            const { structureName, structureType, routePath } = option;

            let path = routePath;
            if (!path) {
                path = structureName.toLowerCase().replace(/\s+/, '-');
            }

            createAppConfig({
                structureName: structureName,
                path: path,
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
                        {options.items.map((item, i) => {
                            const { store } = getOptions(item.structureName, item.structureType);

                            return (
                                <React.Fragment key={i}>
                                    <Route path={store?.getState().paths.create} element={item.createComponent} />
                                    {item.structureType === 'list' && (
                                        <>
                                            <Route
                                                path={`${store?.getState().paths.update}/:structureId/:itemId`}
                                                element={item.updateComponent}
                                            />
                                            <Route
                                                path={`${store?.getState().paths.listing}`}
                                                element={<StructureListListing listName={item.structureName} />}
                                            />

                                            <Route
                                                path={'list/show/:listName/:listId'}
                                                element={<ListItemShowItem />}
                                            />
                                        </>
                                    )}

                                    {item.structureType === 'map' && (
                                        <>
                                            <Route
                                                path={`${store?.getState().paths.update}/:structureId/:itemId`}
                                                element={item.updateComponent}
                                            />
                                            <Route
                                                path={`${store?.getState().paths.listing}`}
                                                element={<StructuredMapsListing mapName={item.structureName} />}
                                            />

                                            <Route path={'map/show/:mapName/:mapId'} element={<MapItemShowItem />} />
                                        </>
                                    )}

                                    {item.structureType === 'variable' && (
                                        <>
                                            <Route
                                                path={`${store?.getState().paths.update}/:structureId/:variableLocale`}
                                                element={item.updateComponent}
                                            />
                                            <Route
                                                path={`${store?.getState().paths.listing}`}
                                                element={<VariableListListing name={item.structureName} />}
                                            />

                                            <Route
                                                path={'variable/show/:variableName/:locale'}
                                                element={<VariableShowItem />}
                                            />
                                        </>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </Route>
                </Routes>
            </BrowserRouter>
        </Container>
    );
}
