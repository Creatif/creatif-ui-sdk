// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/api/css/apiBase.module.css';
import { LocaleSelect } from '@app/routes/api/components/LocaleSelect';
import { StructureSelect } from '@app/routes/api/components/StructureSelect';
import { Checkbox, Button, TextInput } from '@mantine/core';
import { useState } from 'react';
import type { StructureType } from '@root/types/shell/shell';
import { useQuery } from 'react-query';
import UIError from '@app/components/UIError';
import { Result } from '@app/routes/api/components/Result';
import type { CreatifError } from '@root/types/api/publicApi/Http';
import { DirectionSelect } from '@app/routes/api/components/DirectionSelect';
import { SortFields } from '@app/routes/api/components/SortFields';
import { GroupsSelect } from '@app/routes/api/components/GroupsSelect';
import { paginateListItems } from '@lib/publicApi/app/lists/paginateListItems';
import type { OrderBy, OrderDirection } from '@root/types/api/publicApi/Shared';

interface Props {
    versionName: string;
}

export function PaginateLists({ versionName }: Props) {
    const [structureData, setStructureData] = useState<{ name: string; type: StructureType }>();
    const [selectedLocale, setSelectedLocale] = useState<string>('');
    const [selectedDirection, setSelectedDirection] = useState<OrderDirection>('desc');
    const [sortField, setSortField] = useState<OrderBy>('created_at');
    const [groups, setGroups] = useState<string[]>([]);
    const [search, setSearch] = useState('');

    const [isError, setIsError] = useState<'notFound' | 'generalError' | undefined>(undefined);
    const [isValueOnly, setIsValueOnly] = useState(false);

    const [submitQueryEnabled, setSubmitQueryEnabled] = useState(false);

    let errorMessage = '';
    if (isError && isError === 'notFound') {
        errorMessage = 'Item is not found';
    } else if (isError && isError === 'generalError') {
        errorMessage = 'Something went wrong. Please try again later.';
    }

    const { isFetching, data } = useQuery(
        [
            'paginate_public_api_lists',
            structureData,
            selectedLocale,
            submitQueryEnabled,
            isValueOnly,
            versionName,
            search,
        ],
        async () => {
            if (!structureData) return;

            if (structureData) {
                const { result, error } = await paginateListItems({
                    versionName: versionName,
                    structureName: structureData.name,
                    page: 1,
                    limit: 100,
                    search: search,
                    orderBy: sortField,
                    orderDirection: selectedDirection,
                    locales: [selectedLocale],
                    groups: groups,
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
            enabled: submitQueryEnabled,
            refetchOnWindowFocus: false,
            keepPreviousData: true,
            staleTime: Infinity,
            retry: -1,
            onError(error: CreatifError) {
                if (error.status === 404) {
                    setIsError('notFound');
                } else {
                    setIsError('generalError');
                }

                setSubmitQueryEnabled(false);
            },
        },
    );

    return (
        <div className={styles.root}>
            <div className={styles.selectWrapper}>
                <form
                    className={styles.singleColumnWrapper}
                    onSubmit={(env) => {
                        env.preventDefault();
                        env.stopPropagation();
                        setSubmitQueryEnabled(true);
                    }}>
                    <div className={styles.fieldsGrid}>
                        <StructureSelect
                            structureToShow="list"
                            onSelected={(name, structureType) => {
                                setStructureData({ name: name, type: structureType });
                            }}
                        />
                        <TextInput
                            description="Search"
                            placeholder="Search"
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                        />
                        <LocaleSelect onSelected={setSelectedLocale} />
                        <DirectionSelect onChange={setSelectedDirection} />
                        <SortFields onChange={setSortField} />
                        <GroupsSelect onSelectedGroups={setGroups} />

                        <Checkbox
                            className={styles.valueOnlyCheckbox}
                            checked={isValueOnly}
                            onChange={(env) => {
                                setIsValueOnly(env.target.checked);
                            }}
                            label="Value only"
                        />
                    </div>

                    <div className={styles.buttonWrapper}>
                        <Button
                            loading={isFetching}
                            loaderProps={{
                                size: 16,
                            }}
                            type="submit"
                            className={styles.findButton}
                            variant="outline">
                            Find
                        </Button>
                    </div>
                </form>
            </div>

            {structureData && data && (
                <div className={styles.viewSection}>
                    <Result
                        data={data}
                        versionName={versionName}
                        curlBlueprint={{
                            page: 1,
                            limit: 100,
                            structureName: structureData.name,
                            locales: [selectedLocale],
                            orderDirection: selectedDirection,
                            orderBy: sortField,
                            groups: groups,
                            search: search,
                            options: {
                                valueOnly: isValueOnly,
                            },
                        }}
                        curlType="paginateLists"
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
