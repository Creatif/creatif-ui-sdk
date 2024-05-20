import { Tabs } from '@mantine/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/api/css/apiBase.module.css';
import JSON from '@app/uiComponents/external/Json';
import { Curl } from '@app/routes/api/components/Curl';
import type { GetListItemByID, GetListItemsByName } from '@root/types/api/publicApi/Lists';
import type { GetMapItemByID } from '@root/types/api/publicApi/Maps';
import { useEffect, useState } from 'react';

interface Props {
    data: object;
    curlBlueprint: GetListItemByID | GetListItemsByName | GetMapItemByID;
    curlType: 'getListItemsByName' | 'getListItemById' | 'getMapItemById' | 'getMapItemByName';
}
export function Result({ data, curlBlueprint, curlType }: Props) {
    const [reRenderJson, setReRenderJson] = useState(true);

    useEffect(() => {
        if (data) {
            setReRenderJson(false);
            setTimeout(() => {
                setReRenderJson(true);
            }, 50);
        }
    }, [data]);

    return (
        <Tabs variant="outline" defaultValue="rawResponse">
            <Tabs.List>
                <Tabs.Tab value="rawResponse">JSON response</Tabs.Tab>
                <Tabs.Tab value="curl">CURL</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="rawResponse">
                {reRenderJson && (
                    <div className={styles.jsonData}>
                        <JSON value={data} />
                    </div>
                )}
            </Tabs.Panel>

            <Tabs.Panel value="curl">
                <Curl type={curlType} blueprint={curlBlueprint} />
            </Tabs.Panel>
        </Tabs>
    );
}
