// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/api/css/apiBase.module.css';
import type { StructureType } from '@root/types/shell/shell';
import { useState } from 'react';
import { StructureSelect } from '@app/uiComponents/api/components/StructureSelect';
import JSON from '@app/uiComponents/external/Json';
import { useQuery } from 'react-query';
import UIError from '@app/components/UIError';
import { getListItemById } from '@lib/publicApi/app/lists/getListItemById';
import { getMapItemById } from '@lib/publicApi/app/maps/getMapItemById';
import { ComboboxIDSelect } from '@app/uiComponents/api/components/ComboboxIDSelect';
import { Checkbox, Loader } from '@mantine/core';
import { Curl } from '@app/uiComponents/api/components/Curl';
import { Result } from '@app/uiComponents/api/components/Result';

export function GetByID() {
    const [id, setId] = useState<string>('');
    const [structureData, setStructureData] = useState<{ name: string; type: StructureType }>();
    const [isError, setIsError] = useState(false);

    const [isValueOnly, setIsValueOnly] = useState(false);

    const { isFetching, data } = useQuery(
        ['get_item_by_id', structureData, id, isValueOnly],
        async () => {
            if (!id || !structureData) return;

            if (structureData && id) {
                if (structureData.type === 'list') {
                    const { result, error } = await getListItemById({
                        id: id,
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
                    const { result, error } = await getMapItemById({
                        id: id,
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
            onError() {
                setIsError(true);
            },
        },
    );

    return (
        <div className={styles.root}>
            <div className={styles.selectWrapper}>
                <div className={styles.selectActionWrapper}>
                    <ComboboxIDSelect structureData={structureData} onSelected={(id) => setId(id)} />
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

                {isFetching && <Loader size={20} />}
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

            {isError && (
                <UIError
                    style={{
                        marginTop: '1rem',
                    }}
                    title="Unable to get item. Please, try again later."
                />
            )}
        </div>
    );
}
