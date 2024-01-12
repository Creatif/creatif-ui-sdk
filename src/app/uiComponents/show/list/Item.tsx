import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UIError from '@app/components/UIError';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/show/css/item.module.css';
import { Button, Fieldset } from '@mantine/core';
import { IconChevronDown, IconChevronRight, IconClock } from '@tabler/icons-react';
import appDate from '@lib/helpers/appDate';
import Loading from '@app/components/Loading';
import Groups from '@app/components/Groups';
import type { Column } from '@lib/helpers/useValueFields';
import useValueFields from '@lib/helpers/useValueFields';
import Copy from '@app/components/Copy';
import classNames from 'classnames';
import { getOptions } from '@app/systems/stores/options';
import useQueryListItem from '@app/uiComponents/lists/hooks/useQueryListItem';

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
    const { listName, listId } = useParams();
    if (!listId || !listId) {
        return (
            <UIError title="Invalid route">
                We tried to show a variable but the route is invalid. A variable route needs to have a variable name and
                locale in the URL
            </UIError>
        );
    }

    const { isFetching, data } = useQueryListItem(listName, listId, true);
    if (!data?.result) {
        return (
            <div className={classNames(styles.root, styles.loadingRoot)}>
                <Loading isLoading={isFetching} />
            </div>
        );
    }

    const { store: useOptions } = getOptions(listName as string);

    const values = useValueFields(data.result.value);

    return (
        <div className={styles.root}>
            <h2 className={styles.variableName}>
                {data.result.name}
                {useOptions && (
                    <Button
                        size="compact-xs"
                        component={Link}
                        to={`${useOptions.getState().paths.update}/${data.result.id}/${data.result.locale}`}>
                        Edit
                    </Button>
                )}
            </h2>
            <p className={styles.createdAt}>
                <IconClock size={14} color="var(--mantine-color-gray-6)" />
                {appDate(data.result.createdAt)}
            </p>

            <div className={styles.content}>
                <Fieldset
                    style={{
                        marginBottom: '2rem',
                    }}
                    legend="Structure data">
                    <div className={styles.contentGrid}>
                        <div className={styles.row}>
                            <h2>ID</h2>
                            <div className={styles.rowValue}>
                                {data.result.id}{' '}
                                <Copy onClick={() => navigator.clipboard.writeText(data?.result?.id || '')} />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <h2>Short ID</h2>
                            <div className={styles.rowValue}>
                                {data.result.shortId}{' '}
                                <Copy onClick={() => navigator.clipboard.writeText(data?.result?.id || '')} />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <h2>Behaviour</h2>
                            <div>{data.result.behaviour}</div>
                        </div>

                        <div className={styles.row}>
                            <h2>Groups</h2>
                            <div>{data.result.groups && <Groups groups={data.result.groups} />}</div>
                        </div>

                        <div className={styles.row}>
                            <h2>Locale</h2>
                            <div>{data.result.locale}</div>
                        </div>
                    </div>
                </Fieldset>

                <Fieldset
                    style={{
                        marginBottom: '2rem',
                    }}
                    legend="Your data">
                    <div className={styles.contentGrid}>
                        <ColumnValue values={values} isInnerRow={false} />
                    </div>
                </Fieldset>
            </div>
        </div>
    );
}
