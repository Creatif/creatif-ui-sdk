import { ListList as StructureListListing } from '@app/uiComponents/lists/ListList';
import { ListList as StructuredMapsListing } from '@app/uiComponents/maps/ListList';
import { ListList as VariableListListing } from '@app/uiComponents/variables/ListList';
import Header from '@app/uiComponents/shell/Header';
import Navigation from '@app/uiComponents/shell/Navigation';
import { Container } from '@mantine/core';
import React from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/root.module.css';
import type { Shell, CreatifApp } from '@root/types/shell/shell';
import { Item as VariableShowItem } from '@app/uiComponents/show/variable/Item';
import { Item as ListItemShowItem } from '@app/uiComponents/show/list/Item';
import { Item as MapItemShowItem } from '@app/uiComponents/show/map/Item';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import { AddGroup } from '@app/uiComponents/groups/AddGroup';
interface Props {
    options: CreatifApp;
}
export default function Shell({ options }: Props) {
    const store = getProjectMetadataStore();
    const structures = store.getState().structureItems;

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
                        <Route path="/groups" element={<AddGroup />} />

                        {structures.map((item, i) => {
                            const configOption = options.items.find((option) => option.structureName === item.name);
                            if (!configOption) return null;

                            return (
                                <React.Fragment key={i}>
                                    <Route path={item.createPath} element={configOption.createComponent} />
                                    {item.structureType === 'list' && (
                                        <>
                                            <Route path={item.updatePath} element={configOption.updateComponent} />
                                            <Route
                                                path={item.listPath}
                                                element={<StructureListListing listName={item.name} />}
                                            />

                                            <Route path={item.showPath} element={<ListItemShowItem />} />
                                        </>
                                    )}

                                    {item.structureType === 'map' && (
                                        <>
                                            <Route path={item.updatePath} element={configOption.updateComponent} />
                                            <Route
                                                path={item.listPath}
                                                element={<StructuredMapsListing mapName={item.name} />}
                                            />

                                            <Route path={item.showPath} element={<MapItemShowItem />} />
                                        </>
                                    )}

                                    {item.structureType === 'variable' && (
                                        <>
                                            <Route path={item.updatePath} element={configOption.updateComponent} />
                                            <Route
                                                path={item.listPath}
                                                element={<VariableListListing name={item.name} />}
                                            />

                                            <Route path={item.updatePath} element={<VariableShowItem />} />
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
