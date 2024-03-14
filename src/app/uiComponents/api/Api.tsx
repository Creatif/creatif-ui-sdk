// @ts-ignore
import baseStyles from '@app/uiComponents/api/css/base.module.css';
import { VersionSelect } from '@app/uiComponents/api/components/VersionSelect';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Accordion } from '@mantine/core';
import { GetByID } from '@app/uiComponents/api/components/GetByID';
import { initialize } from '@lib/publicApi/app/initialize';
import { Runtime } from '@app/runtime/Runtime';

const httpCalls = [
    {
        title: 'Get list/map item by ID',
        id: 'getItemById',
    },
    {
        title: 'Get list item by name and locale (getListItemByNameAndLocale)',
        id: 'getListItemByNameAndLocale',
    },
    {
        title: 'Get list items by name (getListItemByName)',
        id: 'getListItemsByName',
    },
    {
        title: 'Get map item by ID (getMapItemById)',
        id: 'getMapItemById',
    },
    {
        title: 'Get map item by name (getMapItemByName)',
        id: 'getMapItemByName',
    },
];

export function Api() {
    const [versionId, setVersionId] = useState<string | null>('');
    const [controlledAccordionValue, setControlledAccordionValue] = useState<string | null>('');

    initialize(Runtime.instance.credentials.projectId);

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
                    {controlledAccordionValue === item.id && (
                        <Accordion.Panel>
                            <GetByID />
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
