import { IDSelect } from '@app/uiComponents/api/components/IDSelect';

// @ts-ignore
import styles from '@app/uiComponents/api/css/apiBase.module.css';
import { StructureType } from '@root/types/shell/shell';
import { useState } from 'react';
import { StructureSelect } from '@app/uiComponents/api/components/StructureSelect';
import JSON from '@app/uiComponents/external/Json';
import { useQuery } from 'react-query';
import UIError from '@app/components/UIError';
import { getListItemById } from '@lib/publicApi/app/lists/getListItemById';
import { getMapItemById } from '@lib/publicApi/app/maps/getMapItemById';

interface Props {
    structureType: StructureType;
}

export function GetByID({ structureType }: Props) {
    const [id, setId] = useState<string>('');
    const [structureData, setStructureData] = useState<{ name: string; type: StructureType }>();
    const [isError, setIsError] = useState(false);

    const { isFetching, data } = useQuery(
        ['get_item_by_id', structureData, id],
        async () => {
            if (!id || !structureData) return;

            if (structureData && id) {
                if (structureData.type === 'list') {
                    const { result, error } = await getListItemById({
                        id: id,
                    });

                    if (error) throw error;

                    if (result) {
                        return result;
                    }
                }

                if (structureData.type === 'map') {
                    const { result, error } = await getMapItemById({
                        id: id,
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
            onError() {
                setIsError(true);
            },
        },
    );

    return (
        <div className={styles.root}>
            <div className={styles.selectWrapper}>
                <IDSelect structureData={structureData} onSelected={(id) => setId(id)} />
                <StructureSelect
                    onSelected={(name, structureType) => {
                        setStructureData({ name: name, type: structureType });
                        setId('');
                    }}
                />
            </div>

            {id && (
                <p className={styles.selectedId}>
                    Selected ID: <span>{id}</span>
                </p>
            )}

            {isError && (
                <UIError
                    style={{
                        marginTop: '1rem',
                    }}
                    title="Unable to get item. Please, try again later."
                />
            )}

            {!isFetching && data && (
                <div className={styles.jsonData}>
                    <JSON value={data} />
                </div>
            )}
        </div>
    );
}
