// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/api/css/apiBase.module.css';
import type { StructureType } from '@root/types/shell/shell';
import { useState } from 'react';
import { StructureSelect } from '@app/routes/api/components/StructureSelect';
import { useQuery } from 'react-query';
import UIError from '@app/components/UIError';
import { getListItemById } from '@lib/publicApi/app/lists/getListItemById';
import { getMapItemById } from '@lib/publicApi/app/maps/getMapItemById';
import { ComboboxIDSelect } from '@app/routes/api/components/ComboboxIDSelect';
import { Checkbox } from '@mantine/core';
import { Result } from '@app/routes/api/components/Result';
import type { ApiError } from '@lib/http/apiError';
import type { ListItem } from '@root/types/api/publicApi/Lists';
import type { MapItem } from '@root/types/api/publicApi/Maps';

interface Props {
    versionName: string;
}

export function GetByID({ versionName }: Props) {
    const [id, setId] = useState<string>('');
    const [structureData, setStructureData] = useState<{ name: string; type: StructureType }>();

    const [isValueOnly, setIsValueOnly] = useState(false);

    const { isFetching, data, error } = useQuery<ListItem<unknown> | MapItem<unknown> | undefined, ApiError>(
        ['get_item_by_id', structureData, id, isValueOnly, versionName],
        async () => {
            if (!id || !structureData) return;

            if (structureData && id) {
                if (structureData.type === 'list') {
                    const { result, error } = await getListItemById<unknown>({
                        id: id,
                        versionName: versionName,
                        options: {
                            valueOnly: isValueOnly,
                        },
                    });

                    if (error) throw error;

                    if (result) {
                        return result;
                    }
                }

                if (structureData.type === 'map') {
                    const { result, error } = await getMapItemById<unknown>({
                        id: id,
                        versionName: versionName,
                        options: {
                            valueOnly: isValueOnly,
                        },
                    });

                    if (error) throw error;

                    if (result) {
                        return result;
                    }
                }
            }
        },
        {
            enabled: Boolean(id && structureData),
            refetchOnWindowFocus: false,
            keepPreviousData: true,
            staleTime: -1,
            retry: -1,
        },
    );

    return (
        <div className={styles.root}>
            <div className={styles.selectWrapper}>
                <div className={styles.selectActionWrapper}>
                    <ComboboxIDSelect
                        versionName={versionName}
                        structureData={structureData}
                        onSelected={(id) => setId(id)}
                    />
                    <StructureSelect
                        onSelected={(name, structureType) => {
                            setStructureData({ name: name, type: structureType });
                            setId('');
                        }}
                    />

                    <Checkbox
                        className={styles.valueOnlyCheckbox}
                        checked={isValueOnly}
                        onChange={(env) => setIsValueOnly(env.target.checked)}
                        label="Value only"
                    />
                </div>
            </div>

            {id && data && (
                <div className={styles.viewSection}>
                    <Result
                        data={data}
                        curlBlueprint={{
                            id: id,
                            options: {
                                valueOnly: isValueOnly,
                            },
                        }}
                        curlType="getListItemById"
                    />
                </div>
            )}

            {error && error.status === 404 && (
                <UIError
                    style={{
                        marginTop: '1rem',
                    }}
                    title="This item could not be found"
                />
            )}

            {error && error.status !== 404 && (
                <UIError
                    style={{
                        marginTop: '1rem',
                    }}
                    title="Something went wrong. Please, try again later."
                />
            )}
        </div>
    );
}
