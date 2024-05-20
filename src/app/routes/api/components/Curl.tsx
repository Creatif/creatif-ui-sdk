import { Routes } from '@lib/publicApi/lib/http/routes';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/api/css/apiBase.module.css';
import { parseQuery } from '@lib/publicApi/app/parseQuery';
import type { GetListItemByID, GetListItemsByName } from '@root/types/api/publicApi/Lists';
import Copy from '@app/components/Copy';
import { Runtime } from '@lib/publicApi/lib/runtime';
import type { GetMapItemByID, GetMapItemByName } from '@root/types/api/publicApi/Maps';

function constructUrl(type: string, blueprint: GetListItemByID | GetListItemsByName | GetMapItemByID) {
    if (type === 'getListItemById' || type === 'getMapItemById') {
        const b = blueprint as GetListItemByID;
        return `${Runtime.instance.baseUrl()}${Routes.GET_LIST_ITEM_BY_ID}/${b.id}${parseQuery(b.options, undefined)}`;
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

    throw new Error(`Cannot construct URL with type ${type} and blueprint ${JSON.stringify(blueprint)}`);
}

interface Props {
    type: string;
    blueprint: GetListItemByID | GetListItemsByName | GetMapItemByName;
}

export function Curl({ blueprint, type }: Props) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const url = constructUrl(type, blueprint);

    return (
        <div className={styles.curl}>
            <p className={styles.curlOverflowedSection}>
                <span
                    style={{
                        fontWeight: 500,
                    }}>
                    curl
                </span>{' '}
                {url}
            </p>

            <div className={styles.curlCopyIcon}>
                <Copy
                    onClick={() => {
                        navigator.clipboard.writeText(`curl ${url}`);
                    }}
                />
            </div>
        </div>
    );
}
