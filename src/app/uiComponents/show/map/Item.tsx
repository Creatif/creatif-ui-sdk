import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UIError from '@app/components/UIError';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/show/css/item.module.css';
import { Button, Tabs } from '@mantine/core';
import { IconChevronDown, IconChevronRight, IconClock } from '@tabler/icons-react';
import appDate from '@lib/helpers/appDate';
import Loading from '@app/components/Loading';
import type { Column } from '@lib/helpers/useValueFields';
import useValueFields from '@lib/helpers/useValueFields';
import classNames from 'classnames';
import { getOptions } from '@app/systems/stores/options';
import useQueryMapVariable from '@app/uiComponents/maps/hooks/useQueryMapVariable';
import useTabs from '@app/uiComponents/show/shared/useTabs';
import StructureItem from '@app/uiComponents/show/map/StructureItem';
import Reference from '@app/uiComponents/show/map/Reference';

function ColumnValue({ values, isInnerRow }: { values: Column[]; isInnerRow: boolean }) {
    const [isInnerExpanded, setIsInnerExpanded] = useState(false);
    const toggleChevron = isInnerExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />;

    return (
        <div className={isInnerRow ? styles.columnSpacing : undefined}>
            {values.map((item, i) => {
                const isNextInnerColumn = values[i + 1] && values[i + 1].innerColumn;

                return (
                    <React.Fragment key={i}>
                        {item.column && (
                            <div
                                className={classNames(
                                    styles.row,
                                    isNextInnerColumn ? styles.hasExpandableRow : undefined,
                                )}>
                                <h2
                                    onClick={() => {
                                        if (isNextInnerColumn) {
                                            setIsInnerExpanded((item) => !item);
                                        }
                                    }}
                                    className={isNextInnerColumn ? styles.expandableHeader : undefined}>
                                    {item.column} {isNextInnerColumn && toggleChevron}
                                </h2>
                                <div className={styles.textValue}>{item.value}</div>
                            </div>
                        )}

                        {item.innerColumn && isInnerExpanded && (
                            <ColumnValue values={item.innerColumn} isInnerRow={true} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export function Item() {
    const { mapName, mapId } = useParams();
    const { isFetching, data } = useQueryMapVariable(mapName, mapId, true);

    const { store: useOptions } = getOptions(mapName as string, 'map');

    const values = useValueFields(data?.result?.value);
    const [selectedTab, tabs, onChange] = useTabs((data && data.result && data.result.references) || []);

    return (
        <>
            {!mapName ||
                (!mapId && (
                    <UIError title="Invalid route">
                        We tried to show a variable but the route is invalid. A variable route needs to have a variable
                        name and locale in the URL
                    </UIError>
                ))}

            {!data?.result && (
                <div className={classNames(styles.root, styles.loadingRoot)}>
                    <Loading isLoading={isFetching} />
                </div>
            )}

            {data?.result && (
                <div className={styles.root}>
                    <h2 className={styles.variableName}>
                        {data.result.name}
                        {useOptions && (
                            <div className={styles.actionCollection}>
                                <Button
                                    component={Link}
                                    to={`${useOptions.getState().paths.update}/${mapName}/${data.result.id}`}>
                                    Update
                                </Button>

                                <Button
                                    color="red"
                                    component={Link}
                                    to={`${useOptions.getState().paths.update}/${mapName}/${data.result.id}`}>
                                    Delete
                                </Button>
                            </div>
                        )}
                    </h2>
                    <p className={styles.createdAt}>
                        <IconClock size={14} color="var(--mantine-color-gray-6)" />
                        {appDate(data.result.createdAt)}
                    </p>

                    <div className={styles.content}>
                        <Tabs keepMounted={false} variant="outline" defaultValue="structure">
                            <Tabs.List>
                                {tabs.map((t) => (
                                    <Tabs.Tab value={t.value} key={t.value}>
                                        {t.label}
                                    </Tabs.Tab>
                                ))}
                            </Tabs.List>

                            {tabs.map((t) => (
                                <Tabs.Panel key={t.value} value={t.value}>
                                    {t.value === 'structure' && data.result && <StructureItem variable={data.result} />}
                                    {t.value === 'yourData' && values && (
                                        <div className={styles.contentGrid}>
                                            <ColumnValue values={values} isInnerRow={false} />
                                        </div>
                                    )}

                                    {t.type === 'reference' && t.reference && data.result && (
                                        <Reference reference={t.reference} itemId={data.result.id} />
                                    )}
                                </Tabs.Panel>
                            ))}
                        </Tabs>
                    </div>
                </div>
            )}
        </>
    );
}
