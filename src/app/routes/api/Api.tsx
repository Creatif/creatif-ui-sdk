// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import baseStyles from '@app/routes/api/css/base.module.css';
import { VersionSelect } from '@app/routes/api/components/VersionSelect';
import { useMemo, useState } from 'react';
import { Accordion } from '@mantine/core';
import { GetByID } from '@app/routes/api/components/GetByID';
import { initialize } from '@lib/publicApi/app/initialize';
import { Runtime } from '@app/systems/runtime/Runtime';
import { GetListItemsByName } from '@app/routes/api/components/GetListItemsByName';
import { GetMapItemByName } from '@app/routes/api/components/GetMapItemByName';
import { PaginateLists } from '@app/routes/api/components/PaginateLists';

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
];

export function Api() {
    const [versionId, setVersionId] = useState<string | null>('');
    const [controlledAccordionValue, setControlledAccordionValue] = useState<string | null>('');

    initialize(Runtime.instance.currentProjectCache.getProject().id);

    const items = useMemo(
        () =>
            httpCalls.map((item) => (
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
                            <GetByID />
                        </Accordion.Panel>
                    )}

                    {controlledAccordionValue === item.id && item.id === 'getListItemsByName' && (
                        <Accordion.Panel>
                            <GetListItemsByName />
                        </Accordion.Panel>
                    )}

                    {controlledAccordionValue === item.id && item.id === 'getMapItemByName' && (
                        <Accordion.Panel>
                            <GetMapItemByName />
                        </Accordion.Panel>
                    )}

                    {controlledAccordionValue === item.id && item.id === 'paginateLists' && (
                        <Accordion.Panel>
                            <PaginateLists />
                        </Accordion.Panel>
                    )}
                </Accordion.Item>
            )),
        [controlledAccordionValue],
    );

    return (
        <div className={baseStyles.container}>
            <h1 className={baseStyles.heading}>API</h1>

            <div className={baseStyles.contentSection}>
                <VersionSelect onVersionChange={(id) => setVersionId(id)} />
            </div>

            {versionId && (
                <Accordion value={controlledAccordionValue} onChange={(value) => setControlledAccordionValue(value)}>
                    {items}
                </Accordion>
            )}
        </div>
    );
}
