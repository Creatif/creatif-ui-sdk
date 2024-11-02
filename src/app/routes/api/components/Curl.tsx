import { Routes } from '@lib/publicApi/lib/http/routes';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/api/css/apiBase.module.css';
import { parseQuery } from '@lib/publicApi/app/parseQuery';
import type { GetListItemByID, GetListItemsByName, PaginateListItems } from '@root/types/api/publicApi/Lists';
import Copy from '@app/components/Copy';
import { Runtime } from '@lib/publicApi/lib/runtime';
import type { GetMapItemByID, GetMapItemByName, PaginateMapItems } from '@root/types/api/publicApi/Maps';
import { queryConstructor } from '@lib/publicApi/lib/queryConstructor';

function constructUrl(
    type: string,
    blueprint: GetListItemByID | GetListItemsByName | GetMapItemByID | PaginateListItems,
) {
    if (type === 'getListItemById') {
        const b = blueprint as GetListItemByID;
        return `${Runtime.instance.baseUrl()}${Routes.GET_LIST_ITEM_BY_ID}/${b.id}${parseQuery(b.options, undefined)}`;
    }

    if (type === 'getMapItemById') {
        const b = blueprint as GetListItemByID;
        return `${Runtime.instance.baseUrl()}${Routes.GET_MAP_ITEM_BY_ID}/${b.id}${parseQuery(b.options, undefined)}`;
    }

    if (type === 'getListItemsByName') {
        const b = blueprint as GetListItemsByName;
        return `${Runtime.instance.baseUrl()}${Routes.GET_LISTS_ITEMS_BY_NAME}/${b.structureName}/${b.name}${parseQuery(
            b.options,
            b.locale,
        )}`;
    }

    if (type === 'getMapItemByName') {
        const b = blueprint as GetMapItemByName;
        return `${Runtime.instance.baseUrl()}${Routes.GET_MAP_ITEM_BY_NAME}/${b.structureName}/${b.name}${parseQuery(
            b.options,
            b.locale,
        )}`;
    }

    if (type === 'paginateLists') {
        const b = blueprint as PaginateListItems;
        return `${Runtime.instance.baseUrl()}${Routes.GET_LIST_ITEMS}/${b.structureName}${queryConstructor(
            1,
            100,
            b.groups,
            b.orderBy,
            b.orderDirection,
            b.search,
            b.locales,
        )}`;
    }

    if (type === 'paginateMaps') {
        const b = blueprint as PaginateMapItems;
        return `${Runtime.instance.baseUrl()}${Routes.GET_MAP_ITEMS}/${b.structureName}${queryConstructor(
            1,
            100,
            b.groups,
            b.orderBy,
            b.orderDirection,
            b.search,
            b.locales,
        )}`;
    }

    throw new Error(`Cannot construct URL with type ${type} and blueprint ${JSON.stringify(blueprint)}`);
}

interface Props {
    type: string;
    versionName: string;
    blueprint: GetListItemByID | GetListItemsByName | GetMapItemByName | PaginateListItems | PaginateMapItems;
}

export function Curl({ blueprint, type, versionName }: Props) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const url = constructUrl(type, blueprint);
    let versionHeader = '';
    if (versionName) {
        versionHeader = `-H "Creatif-Version: ${versionName}"`;
    }

    return (
        <div className={styles.curl}>
            <p className={styles.curlOverflowedSection}>
                <span
                    style={{
                        fontWeight: 500,
                    }}>
                    curl
                </span>{' '}
                {versionHeader} &quot;{url}&quot;
            </p>

            <div className={styles.curlCopyIcon}>
                <Copy
                    onClick={() => {
                        navigator.clipboard.writeText(`curl ${versionHeader} ${url}`);
                    }}
                />
            </div>
        </div>
    );
}
