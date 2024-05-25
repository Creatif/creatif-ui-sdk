import { Tabs } from '@mantine/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Curl } from '@app/routes/api/components/Curl';
import type { GetListItemByID, GetListItemsByName, PaginateListItems } from '@root/types/api/publicApi/Lists';
import type { GetMapItemByID } from '@root/types/api/publicApi/Maps';
import JSONPretty from 'react-json-pretty';

interface Props {
    data: object;
    versionName: string;
    curlBlueprint: GetListItemByID | GetListItemsByName | GetMapItemByID | PaginateListItems;
    curlType: 'getListItemsByName' | 'getListItemById' | 'getMapItemById' | 'getMapItemByName' | 'paginateLists';
}
export function Result({ data, curlBlueprint, curlType, versionName }: Props) {
    return (
        <Tabs variant="outline" defaultValue="rawResponse">
            <Tabs.List>
                <Tabs.Tab value="rawResponse">JSON response</Tabs.Tab>
                <Tabs.Tab value="curl">CURL</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="rawResponse">
                <JSONPretty
                    id="json-pretty"
                    data={data}
                    style={{
                        color: 'var(--mantine-color-gray-7)',
                        fontWeight: '500',
                    }}
                    space={6}
                    mainStyle="padding: 1rem"
                    keyStyle="display: inline-block; margin-bottom: 0.5rem; color: var(--mantine-color-gray-7); font-weight: normal"
                    valueStyle="color: var(--mantine-color-blue-7) !important; font-weight: normal"
                    booleanStyle="color: var(--mantine-color-red-7) !important; font-weight: normal"
                    stringStyle="color: var(--mantine-color-green-8) !important; font-weight: normal"
                />
            </Tabs.Panel>

            <Tabs.Panel value="curl">
                <Curl type={curlType} blueprint={curlBlueprint} versionName={versionName} />
            </Tabs.Panel>
        </Tabs>
    );
}
