// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/api/css/apiBase.module.css';
import { LocaleSelect } from '@app/routes/api/components/LocaleSelect';
import { StructureSelect } from '@app/routes/api/components/StructureSelect';
import { Checkbox } from '@mantine/core';
import { ComboboxIDSelect } from '@app/routes/api/components/ComboboxIDSelect';
import { useState } from 'react';
import type { StructureType } from '@root/types/shell/shell';
import { useQuery } from 'react-query';
import UIError from '@app/components/UIError';
import { IconInfoCircle } from '@tabler/icons-react';
import { Result } from '@app/routes/api/components/Result';
import { getMapItemByName } from '@lib/publicApi/app/maps/getMapItemByName';
import type { CreatifError } from '@root/types/api/publicApi/Http';

interface Props {
    versionName: string;
}

export function GetMapItemByName({ versionName }: Props) {
    const [id, setId] = useState<string>('');
    const [structureData, setStructureData] = useState<{ name: string; type: StructureType }>();
    const [selectedLocale, setSelectedLocale] = useState<string>('');
    const [isError, setIsError] = useState<'notFound' | 'generalError' | undefined>(undefined);
    const [isValueOnly, setIsValueOnly] = useState(false);

    let errorMessage = '';
    if (isError && isError === 'notFound') {
        errorMessage = 'Item is not found';
    } else if (isError && isError === 'generalError') {
        errorMessage = 'Something went wrong. Please try again later.';
    }

    const { data } = useQuery(
        ['get_map_item_by_name', structureData, id, selectedLocale, isValueOnly, versionName],
        async () => {
            if (!id || !structureData) return;

            if (structureData && id) {
                const { result, error } = await getMapItemByName({
                    versionName: versionName,
                    name: id,
                    locale: selectedLocale,
                    structureName: structureData.name,
                    options: {
                        valueOnly: isValueOnly,
                    },
                });

                if (error) throw error;

                if (result) {
                    setIsError(undefined);
                    return result;
                }
            }
        },
        {
            refetchOnWindowFocus: false,
            keepPreviousData: true,
            staleTime: -1,
            retry: -1,
            onError(error: CreatifError) {
                if (error.status === 404) {
                    setIsError('notFound');
                } else {
                    setIsError('generalError');
                }
            },
        },
    );

    return (
        <div className={styles.root}>
            <div className={styles.sectionDescription}>
                <IconInfoCircle size="36px" color="var(--mantine-color-indigo-3)" />
                <p>
                    Since map items must have a unique name, specifying a locale is optional but if you specify a name
                    with an incorrect locale (a locale with which this item is not created), the item will not be found.
                </p>
            </div>

            <div className={styles.selectWrapper}>
                <form
                    className={styles.selectActionWrapper}
                    onSubmit={(env) => {
                        env.preventDefault();
                        env.stopPropagation();
                    }}>
                    <ComboboxIDSelect
                        versionName={versionName}
                        toSelect="name"
                        selectedLocale={selectedLocale}
                        structureData={structureData}
                        onSelected={(id) => {
                            setId(id);
                        }}
                    />
                    <LocaleSelect onSelected={setSelectedLocale} />
                    <StructureSelect
                        structureToShow="map"
                        onSelected={(name, structureType) => {
                            setStructureData({ name: name, type: structureType });
                            setId('');
                        }}
                    />

                    <Checkbox
                        className={styles.valueOnlyCheckbox}
                        checked={isValueOnly}
                        onChange={(env) => {
                            setIsValueOnly(env.target.checked);
                        }}
                        label="Value only"
                    />
                </form>
            </div>

            {id && structureData && data && (
                <div className={styles.viewSection}>
                    <Result
                        data={data}
                        versionName={versionName}
                        curlBlueprint={{
                            name: id,
                            locale: selectedLocale,
                            structureName: structureData.name,
                            options: {
                                valueOnly: isValueOnly,
                            },
                        }}
                        curlType="getMapItemByName"
                    />
                </div>
            )}

            {errorMessage && (
                <UIError
                    style={{
                        marginTop: '1rem',
                    }}
                    title={errorMessage}
                />
            )}
        </div>
    );
}
