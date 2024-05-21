import { Container } from '@mantine/core';
import { Outlet, Route, Routes } from 'react-router-dom';
import styles from '@app/uiComponents/shell/css/root.module.css';
import Navigation from '@app/uiComponents/shell/Navigation';
import Header from '@app/uiComponents/shell/Header';
import { AddGroup } from '@app/routes/groups/AddGroup';
import React from 'react';
import { PublishingMain } from '@app/routes/publishing/PublishingMain';
import { Api } from '@app/routes/api/Api';
import { Listing } from '@app/uiComponents/lists/Listing';
import { Item as ShowItem } from '@app/routes/show/Item';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import type { CreatifApp } from '@root/types/shell/shell';
import { Dashboard } from '@app/routes/dashboard/Dashboard';

interface Props {
    options: CreatifApp;
}

export function ShellApp({ options }: Props) {
    const store = getProjectMetadataStore();
    const structures = store?.getState().structureItems;

    return (
        <Container fluid m={0} p={0}>
            <Routes>
                <Route path="/" element={<Dashboard app={options} />}>
                    <Route path="groups" element={<AddGroup />} />

                    {structures.map((item, i) => {
                        const configOption = options.items.find((option) => option.structureName === item.name);
                        if (!configOption) return null;

                        return (
                            <React.Fragment key={i}>
                                <Route path="publishing" element={<PublishingMain />} />
                                <Route path="api" element={<Api />} />
                                <Route path={item.createPath} element={configOption.form} />
                                {item.structureType === 'list' && (
                                    <>
                                        <Route path={item.updatePath} element={configOption.form} />
                                        <Route path={item.listPath} element={<Listing />} />

                                        <Route path={item.showPath} element={<ShowItem />} />
                                    </>
                                )}

                                {item.structureType === 'map' && (
                                    <>
                                        <Route path={item.updatePath} element={configOption.form} />
                                        <Route path={item.listPath} element={<Listing />} />

                                        <Route path={item.showPath} element={<ShowItem />} />
                                    </>
                                )}
                            </React.Fragment>
                        );
                    })}
                </Route>
            </Routes>
        </Container>
    );
}
