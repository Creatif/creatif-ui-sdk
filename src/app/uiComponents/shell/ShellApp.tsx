import { Container } from '@mantine/core';
import { Route, Routes } from 'react-router-dom';
import React, { Suspense, useEffect, useState } from 'react';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import type { CreatifApp } from '@root/types/shell/shell';
import { validateConfig } from '@app/setupUtil';
import { RuntimeValidationModal } from '@app/uiComponents/shared/RuntimeValidationModal';

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

    validationMessages: string[];
}

export function ShellApp({ config }: Props) {
    const store = getProjectMetadataStore();
    const structures = store?.getState().structureItems;
    const [validationMessages, setValidationMessages] = useState<string[] | null>(null);

    useEffect(() => {
        const messages = validateConfig(config);

        if (messages.length !== 0) {
            setValidationMessages(messages);
            return;
        }

        setValidationMessages(null);
    }, [config]);

    return (
        <Container fluid m={0} p={0}>
            <Routes>
                <Route path="/" element={<Dashboard app={config} />}>
                    <Route
                        path="groups"
                        element={
                            <Suspense fallback={null}>
                                <AddGroup validationMessages={validationMessages} />
                            </Suspense>
                        }
                    />

                    {structures.map((item, i) => {
                        const configOption = config.items.find((option) => option.structureName === item.name);
                        if (!configOption) return null;

                        return (
                            <React.Fragment key={i}>
                                <Route
                                    path="publishing"
                                    element={
                                        <Suspense>
                                            <PublishingMain validationMessages={validationMessages} />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="api"
                                    element={
                                        <Suspense>
                                            <Api validationMessages={validationMessages} />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="structures/maps"
                                    element={
                                        <Suspense>
                                            <Map validationMessages={validationMessages} />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="structures/lists"
                                    element={
                                        <Suspense>
                                            <List validationMessages={validationMessages} />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path={item.createPath}
                                    element={
                                        <>
                                            {!validationMessages && configOption.form}
                                            {validationMessages && (
                                                <RuntimeValidationModal validationMessages={validationMessages} />
                                            )}
                                        </>
                                    }
                                />

                                {item.structureType === 'list' && (
                                    <>
                                        <Route
                                            path={item.updatePath}
                                            element={
                                                <>
                                                    {!validationMessages && configOption.form}
                                                    {validationMessages && (
                                                        <RuntimeValidationModal
                                                            validationMessages={validationMessages}
                                                        />
                                                    )}
                                                </>
                                            }
                                        />
                                        <Route
                                            path={item.listPath}
                                            element={
                                                <Suspense>
                                                    <Listing validationMessages={validationMessages} />
                                                </Suspense>
                                            }
                                        />

                                        <Route
                                            path={item.showPath}
                                            element={
                                                <Suspense>
                                                    <ShowItem validationMessages={validationMessages} />
                                                </Suspense>
                                            }
                                        />
                                    </>
                                )}

                                {item.structureType === 'map' && (
                                    <>
                                        <Route
                                            path={item.updatePath}
                                            element={
                                                <>
                                                    {!validationMessages && configOption.form}
                                                    {validationMessages && (
                                                        <RuntimeValidationModal
                                                            validationMessages={validationMessages}
                                                        />
                                                    )}
                                                </>
                                            }
                                        />

                                        <Route
                                            path={item.listPath}
                                            element={
                                                <Suspense>
                                                    <Listing validationMessages={validationMessages} />
                                                </Suspense>
                                            }
                                        />

                                        <Route
                                            path={item.showPath}
                                            element={
                                                <Suspense>
                                                    <ShowItem validationMessages={validationMessages} />
                                                </Suspense>
                                            }
                                        />
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
