// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/api/css/apiBase.module.css';
import { LocaleSelect } from '@app/uiComponents/api/components/LocaleSelect';
import { StructureSelect } from '@app/uiComponents/api/components/StructureSelect';
import { Loader, Checkbox, Button } from '@mantine/core';
import { ComboboxIDSelect } from '@app/uiComponents/api/components/ComboboxIDSelect';
import { useState } from 'react';
import type { StructureType } from '@root/types/shell/shell';
import { useQuery } from 'react-query';
import UIError from '@app/components/UIError';
import { IconInfoCircle } from '@tabler/icons-react';
import { Result } from '@app/uiComponents/api/components/Result';
import { getMapItemByName } from '@lib/publicApi/app/maps/getMapItemByName';

export function GetMapItemByName() {
    const [id, setId] = useState<string>('');
    const [structureData, setStructureData] = useState<{ name: string; type: StructureType }>();
    const [selectedLocale, setSelectedLocale] = useState<string>('');
    const [isError, setIsError] = useState(false);
    const [isValueOnly, setIsValueOnly] = useState(false);

    const [submitQueryEnabled, setSubmitQueryEnabled] = useState(false);

    const { isFetching, data } = useQuery(
        ['get_map_item_by_name', structureData, id, selectedLocale, submitQueryEnabled, isValueOnly],
        async () => {
            if (!submitQueryEnabled) return;
            if (!id || !structureData) return;

            if (structureData && id) {
                const { result, error } = await getMapItemByName({
                    name: id,
                    locale: selectedLocale,
                    structureName: structureData.name,
                    options: {
                        valueOnly: isValueOnly,
                    },
                });

                if (error) throw error;

                if (result) {
                    return result;
                }
            }
        },
        {
            enabled: Boolean(id && structureData && submitQueryEnabled),
            refetchOnWindowFocus: false,
            keepPreviousData: true,
            staleTime: -1,
            onError() {
                setIsError(true);
                setSubmitQueryEnabled(false);
            },
            onSuccess() {
                setSubmitQueryEnabled(false);
            },
        },
    );

    return (
        <div className={styles.root}>
            <div className={styles.sectionDescription}>
                <IconInfoCircle size="36px" color="var(--mantine-color-indigo-3)" />
                <p>
                    Since map items must have a unique name, specifying a locale is optional but if you specify a name
                    with an incorrect locale, the item will not be found.
                </p>
            </div>

            <div className={styles.selectWrapper}>
                <form
                    className={styles.selectActionWrapper}
                    onSubmit={(env) => {
                        env.preventDefault();
                        env.stopPropagation();
                        setSubmitQueryEnabled(true);
                    }}>
                    <ComboboxIDSelect toSelect="name" structureData={structureData} onSelected={(id) => setId(id)} />
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
                            setSubmitQueryEnabled(true);
                        }}
                        label="Value only"
                    />

                    <Button type="submit" className={styles.findButton} variant="outline">
                        Find
                    </Button>
                </form>

                {isFetching && <Loader size={20} />}
            </div>

            {id && structureData && data && (
                <div className={styles.viewSection}>
                    <Result
                        data={data}
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
