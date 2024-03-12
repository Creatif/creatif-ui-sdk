// @ts-ignore
import baseStyles from '@app/uiComponents/api/css/base.module.css';
import { VersionSelect } from '@app/uiComponents/api/components/VersionSelect';
import { useEffect, useMemo, useRef } from 'react';
import { Accordion } from '@mantine/core';
import { GetByID } from '@app/uiComponents/api/components/GetByID';
import { initialize } from '@lib/publicApi/app/initialize';
import { Runtime } from '@app/runtime/Runtime';

const httpCalls = [
    {
        title: (
            <p className={baseStyles.accordionTitle}>
                Get list/map item by ID <span>(getListItemById and getMapItemById)</span>
            </p>
        ),
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
    const versionRef = useRef('');

    initialize(Runtime.instance.credentials.projectId);

    const items = useMemo(() => {
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
                <Accordion.Panel>{item.id === 'getItemById' && <GetByID structureType="list" />}</Accordion.Panel>
            </Accordion.Item>
        ));
    }, []);

    return (
        <div className={baseStyles.container}>
            <h1 className={baseStyles.heading}>API</h1>

            <div className={baseStyles.contentSection}>
                <VersionSelect onVersionChange={(id) => (versionRef.current = id)} />
            </div>

            <Accordion>{items}</Accordion>
        </div>
    );
}
