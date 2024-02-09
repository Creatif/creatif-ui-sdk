import { Listing } from '@app/uiComponents/lists/Listing';
import Header from '@app/uiComponents/shell/Header';
import Navigation from '@app/uiComponents/shell/Navigation';
import { Container } from '@mantine/core';
import React from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/root.module.css';
import type { CreatifApp } from '@root/types/shell/shell';
import { Item as ShowItem } from '@app/uiComponents/show/Item';
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
                                            <Route path={item.listPath} element={<Listing />} />

                                            <Route path={item.showPath} element={<ShowItem />} />
                                        </>
                                    )}

                                    {item.structureType === 'map' && (
                                        <>
                                            <Route path={item.updatePath} element={configOption.updateComponent} />
                                            <Route path={item.listPath} element={<Listing />} />

                                            <Route path={item.showPath} element={<ShowItem />} />
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
