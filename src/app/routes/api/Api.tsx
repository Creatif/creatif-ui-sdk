// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import baseStyles from '@app/routes/api/css/base.module.css';
import { VersionSelect } from '@app/routes/api/components/VersionSelect';
import { useEffect, useMemo, useState } from 'react';
import { Accordion } from '@mantine/core';
import { GetByID } from '@app/routes/api/components/GetByID';
import { initialize } from '@lib/publicApi/app/initialize';
import { Runtime } from '@app/systems/runtime/Runtime';
import { GetListItemsByName } from '@app/routes/api/components/GetListItemsByName';
import { GetMapItemByName } from '@app/routes/api/components/GetMapItemByName';
import { PaginateLists } from '@app/routes/api/components/PaginateLists';
import { useSearchParams } from 'react-router-dom';
import { PaginateMaps } from '@app/routes/api/components/PaginateMaps';
import { useAddActivity } from '@app/systems/activity/useAddActivity';

const httpCalls = [
    {
        title: 'Get list/map item by ID',
        id: 'getItemById',
    },
    {
        title: 'Get list items by name',
        id: 'getListItemsByName',
    },
    {
        title: 'Get map item by name',
        id: 'getMapItemByName',
    },
    {
        title: 'Paginate lists',
        id: 'paginateLists',
    },
    {
        title: 'Paginate maps',
        id: 'paginateMaps',
    },
];

export default function Api() {
    const { addVisitingActivity } = useAddActivity();
    const [controlledAccordionValue, setControlledAccordionValue] = useState<string | null>('');
    const [params, setParams] = useSearchParams();
    const versionId = params.get('version');

    initialize(Runtime.instance.currentProjectCache.getProject().id);

    useEffect(() => {
        addVisitingActivity({
            type: 'visit',
            subType: 'api',
            title: 'Viewed API',
            path: location.pathname,
        });
    }, []);

    const items = useMemo(() => {
        if (!versionId) return null;

        return httpCalls.map((item) => (
            <Accordion.Item key={item.id} value={item.id}>
                <Accordion.Control
                    styles={{
                        control: {
                            padding: '0.7rem',
                        },
                    }}>
                    {item.title}
                </Accordion.Control>
                {controlledAccordionValue === item.id && item.id === 'getItemById' && (
                    <Accordion.Panel>
                        <GetByID versionName={versionId} />
                    </Accordion.Panel>
                )}

                {controlledAccordionValue === item.id && item.id === 'getListItemsByName' && (
                    <Accordion.Panel>
                        <GetListItemsByName versionName={versionId} />
                    </Accordion.Panel>
                )}

                {controlledAccordionValue === item.id && item.id === 'getMapItemByName' && (
                    <Accordion.Panel>
                        <GetMapItemByName versionName={versionId} />
                    </Accordion.Panel>
                )}

                {controlledAccordionValue === item.id && item.id === 'paginateLists' && (
                    <Accordion.Panel>
                        <PaginateLists versionName={versionId} />
                    </Accordion.Panel>
                )}

                {controlledAccordionValue === item.id && item.id === 'paginateMaps' && (
                    <Accordion.Panel>
                        <PaginateMaps versionName={versionId} />
                    </Accordion.Panel>
                )}
            </Accordion.Item>
        ));
    }, [controlledAccordionValue, versionId]);

    return (
        <div className={baseStyles.container}>
            <h1 className={baseStyles.heading}>API</h1>

            <div className={baseStyles.contentSection}>
                <VersionSelect
                    currentVersion={versionId}
                    onVersionChange={(id) => {
                        setParams({
                            version: id,
                        });
                    }}
                />
            </div>

            {versionId && (
                <Accordion value={controlledAccordionValue} onChange={(value) => setControlledAccordionValue(value)}>
                    {items}
                </Accordion>
            )}
        </div>
    );
}
