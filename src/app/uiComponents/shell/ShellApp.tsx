import { Container } from '@mantine/core';
import { Route, Routes } from 'react-router-dom';
import React, { Suspense } from 'react';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import type { CreatifApp } from '@root/types/shell/shell';
import { RuntimeValidationModal } from '@app/uiComponents/shared/RuntimeValidationModal';
import { NoMatchRedirect } from '@app/uiComponents/shell/NoMatchRedirect';

const AddGroup = React.lazy(() => import('@app/routes/groups/AddGroup'));
const Dashboard = React.lazy(() => import('@app/routes/dashboard/Dashboard'));
const PublishingMain = React.lazy(() => import('@app/routes/publishing/PublishingMain'));
const Api = React.lazy(() => import('@app/routes/api/Api'));
const ShowItem = React.lazy(() => import('@app/routes/show/Item'));
const List = React.lazy(() => import('@app/routes/structures/List'));
const Map = React.lazy(() => import('@app/routes/structures/Map'));
const Listing = React.lazy(() => import('@app/uiComponents/lists/Listing'));

interface Props {
    config: CreatifApp;
}

export function ShellApp({ config }: Props) {
    const store = getProjectMetadataStore();
    const structures = store?.getState().structureItems;

    return (
        <Container fluid m={0} p={0}>
            <Routes>
                <Route path="/" element={<Dashboard app={config} />}>
                    <Route
                        path="groups"
                        element={
                            <Suspense fallback={null}>
                                <AddGroup validationMessages={null} />
                            </Suspense>
                        }
                    />

                    {structures.map((item, i) => {
                        const configOption = config.items.find((option) => option.structureName === item.name);

                        return (
                            <React.Fragment key={i}>
                                <Route
                                    path="publishing"
                                    element={
                                        <Suspense>
                                            <PublishingMain validationMessages={null} />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="api"
                                    element={
                                        <Suspense>
                                            <Api validationMessages={null} />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="structures/maps"
                                    element={
                                        <Suspense>
                                            <Map validationMessages={null} />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="structures/lists"
                                    element={
                                        <Suspense>
                                            <List validationMessages={null} />
                                        </Suspense>
                                    }
                                />
                                <Route path={item.createPath} element={<>{configOption && configOption.form}</>} />

                                {item.structureType === 'list' && (
                                    <>
                                        <Route
                                            path={item.updatePath}
                                            element={<>{configOption && configOption.form}</>}
                                        />
                                        <Route
                                            path={item.listPath}
                                            element={
                                                <Suspense>
                                                    <Listing validationMessages={null} />
                                                </Suspense>
                                            }
                                        />

                                        <Route
                                            path={item.showPath}
                                            element={
                                                <Suspense>
                                                    <ShowItem validationMessages={null} />
                                                </Suspense>
                                            }
                                        />
                                    </>
                                )}

                                {item.structureType === 'map' && (
                                    <>
                                        <Route
                                            path={item.updatePath}
                                            element={<>{configOption && configOption.form}</>}
                                        />

                                        <Route
                                            path={item.listPath}
                                            element={
                                                <Suspense>
                                                    <Listing validationMessages={null} />
                                                </Suspense>
                                            }
                                        />

                                        <Route
                                            path={item.showPath}
                                            element={
                                                <Suspense>
                                                    <ShowItem validationMessages={null} />
                                                </Suspense>
                                            }
                                        />
                                    </>
                                )}
                            </React.Fragment>
                        );
                    })}

                    <Route path="*" element={<NoMatchRedirect />} />
                </Route>
            </Routes>
        </Container>
    );
}
