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
import { getListItemsByName } from '@lib/publicApi/app/lists/getListItemsByName';
import UIError from '@app/components/UIError';
import { Result } from '@app/routes/api/components/Result';

interface Props {
    versionName: string;
}

export function GetListItemsByName({ versionName }: Props) {
    const [id, setId] = useState<string>('');
    const [structureData, setStructureData] = useState<{ name: string; type: StructureType }>();
    const [selectedLocale, setSelectedLocale] = useState<string>('');
    const [isError, setIsError] = useState(false);
    const [isValueOnly, setIsValueOnly] = useState(false);

    const { data } = useQuery(
        ['get_list_items_by_name', structureData, id, selectedLocale, isValueOnly, versionName],
        async () => {
            if (!id || !structureData) return;

            if (structureData && id) {
                const { result, error } = await getListItemsByName({
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
                    setIsError(false);
                    return result;
                }
            }
        },
        {
            refetchOnWindowFocus: false,
            keepPreviousData: true,
            staleTime: -1,
            retry: -1,
            onError() {
                setIsError(true);
            },
        },
    );

    return (
        <div className={styles.root}>
            <div className={styles.sectionDescription}>
                <p>
                    If you select the list item from the dropdown, that item will be fetched. If you don&apos;t and just
                    type in the name of your item, all list items with that name will be fetched. If you also select a
                    locale, all items with that name and locale will be fetched. Locale is optional and the default is{' '}
                    <span className={styles.highlight}>eng</span>
                    locale.
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
                        structureToShow="list"
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
                        curlType="getListItemsByName"
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
