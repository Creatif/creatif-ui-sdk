import { Container } from '@mantine/core';
import { Route, Routes } from 'react-router-dom';
import React, { Suspense } from 'react';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import type { CreatifApp } from '@root/types/shell/shell';
import { NoMatchRedirect } from '@app/uiComponents/shell/NoMatchRedirect';
import RouteOutlet from '@app/uiComponents/shell/RouteOutlet';

const AddGroup = React.lazy(() => import('@app/routes/groups/AddGroup'));
const Dashboard = React.lazy(() => import('@app/routes/dashboard/DashboardMain'));
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
                <Route path="/" element={<RouteOutlet app={config} />}>
                    <Route
                        path="/"
                        element={
                            <Suspense fallback={null}>
                                <Dashboard />
                            </Suspense>
                        }
                    />
                    <Route
                        path="groups"
                        element={
                            <Suspense fallback={null}>
                                <AddGroup />
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
                                            <PublishingMain />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="api"
                                    element={
                                        <Suspense>
                                            <Api />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="structures/maps"
                                    element={
                                        <Suspense>
                                            <Map />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="structures/lists"
                                    element={
                                        <Suspense>
                                            <List />
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
                                                    <Listing />
                                                </Suspense>
                                            }
                                        />

                                        <Route
                                            path={item.showPath}
                                            element={
                                                <Suspense>
                                                    <ShowItem />
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
                                                    <Listing />
                                                </Suspense>
                                            }
                                        />

                                        <Route
                                            path={item.showPath}
                                            element={
                                                <Suspense>
                                                    <ShowItem />
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
