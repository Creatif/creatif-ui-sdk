import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetVariable } from '@app/uiComponents/variables/hooks/useGetVariable';
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

function ColumnValue({ values, isInnerRow }: { values: Column[]; isInnerRow: boolean }) {
    const [isInnerExpanded, setIsInnerExpanded] = useState(false);
    const toggleChevron = isInnerExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />;

    return (
        <div className={isInnerRow ? styles.columnSpacing : undefined}>
            {values.map((item, i) => {
                const isNextInnerColumn = values[i+1] && values[i+1].innerColumn;

                return <React.Fragment key={i}>
                    {item.column && (
                        <div className={classNames(styles.row, isNextInnerColumn ? styles.hasExpandableRow : undefined)}>
                            <h2 onClick={() => {
                                if (isNextInnerColumn) {
                                    setIsInnerExpanded((item) => !item);
                                }
                            }} className={isNextInnerColumn ? styles.expandableHeader : undefined}>{item.column} {isNextInnerColumn && toggleChevron}</h2>
                            <div className={styles.textValue}>{item.value}</div>
                        </div>
                    )}

                    {item.innerColumn && isInnerExpanded && <ColumnValue values={item.innerColumn} isInnerRow={true} />}
                </React.Fragment>;
            })}
        </div>
    );
}

export default function Item() {
    const { variableName, locale } = useParams();
    const { store: useOptions } = getOptions(variableName);

    if (!variableName || !locale) {
        return (
            <UIError title="Invalid route">
                We tried to show a variable but the route is invalid. A variable route needs to have a variable name and
                locale in the URL
            </UIError>
        );
    }

    const { isFetching, data } = useGetVariable(variableName, locale, Boolean(variableName && locale));
    if (!data?.result) {
        return (
            <div className={styles.root}>
                <Loading isLoading={isFetching} />
            </div>
        );
    }

    const values = useValueFields({
        string:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque convallis leo orci, in lobortis nisi accumsan sit amet. Pellentesque ac ultricies augue. Donec malesuada justo quis purus dictum, nec dapibus neque elementum. Mauris tempus sem sed vestibulum volutpat. In sed aliquam mauris. Curabitur accumsan leo tempus rhoncus porta. Mauris lorem lectus, bibendum consectetur mauris ut, pulvinar ultricies leo. Vestibulum eget accumsan ante. Nulla blandit nulla at ex ornare eleifend. Pellentesque non justo in nunc ullamcorper porttitor. Cras tempor nulla lectus, a finibus augue volutpat in.\n' +
            '\n',
        number: 5,
        float: 0.6532453,
        array: ['one', 'two', 'three', 'four', 'five'],
        true: true,
        false: false,
        arrayObject: [
            {
                string:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque convallis leo orci, in lobortis nisi accumsan sit amet. Pellentesque ac ultricies augue. Donec malesuada justo quis purus dictum, nec dapibus neque elementum. Mauris tempus sem sed vestibulum volutpat. In sed aliquam mauris. Curabitur accumsan leo tempus rhoncus porta. Mauris lorem lectus, bibendum consectetur mauris ut, pulvinar ultricies leo. Vestibulum eget accumsan ante. Nulla blandit nulla at ex ornare eleifend. Pellentesque non justo in nunc ullamcorper porttitor. Cras tempor nulla lectus, a finibus augue volutpat in.\n' +
                    '\n',
                number: 5,
                float: 0.6532453,
                array: ['one', 'two', 'three', 'four', 'five'],
                true: true,
                false: false,
            },
            {
                string:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque convallis leo orci, in lobortis nisi accumsan sit amet. Pellentesque ac ultricies augue. Donec malesuada justo quis purus dictum, nec dapibus neque elementum. Mauris tempus sem sed vestibulum volutpat. In sed aliquam mauris. Curabitur accumsan leo tempus rhoncus porta. Mauris lorem lectus, bibendum consectetur mauris ut, pulvinar ultricies leo. Vestibulum eget accumsan ante. Nulla blandit nulla at ex ornare eleifend. Pellentesque non justo in nunc ullamcorper porttitor. Cras tempor nulla lectus, a finibus augue volutpat in.\n' +
                    '\n',
                number: 5,
                float: 0.6532453,
                array: ['one', 'two', 'three', 'four', 'five'],
                true: true,
                false: false,
                againInner: {
                    string:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque convallis leo orci, in lobortis nisi accumsan sit amet. Pellentesque ac ultricies augue. Donec malesuada justo quis purus dictum, nec dapibus neque elementum. Mauris tempus sem sed vestibulum volutpat. In sed aliquam mauris. Curabitur accumsan leo tempus rhoncus porta. Mauris lorem lectus, bibendum consectetur mauris ut, pulvinar ultricies leo. Vestibulum eget accumsan ante. Nulla blandit nulla at ex ornare eleifend. Pellentesque non justo in nunc ullamcorper porttitor. Cras tempor nulla lectus, a finibus augue volutpat in.\n' +
                        '\n',
                    number: 5,
                    float: 0.6532453,
                    array: ['one', 'two', 'three', 'four', 'five'],
                    true: true,
                    false: false,
                    more: {
                        string:
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque convallis leo orci, in lobortis nisi accumsan sit amet. Pellentesque ac ultricies augue. Donec malesuada justo quis purus dictum, nec dapibus neque elementum. Mauris tempus sem sed vestibulum volutpat. In sed aliquam mauris. Curabitur accumsan leo tempus rhoncus porta. Mauris lorem lectus, bibendum consectetur mauris ut, pulvinar ultricies leo. Vestibulum eget accumsan ante. Nulla blandit nulla at ex ornare eleifend. Pellentesque non justo in nunc ullamcorper porttitor. Cras tempor nulla lectus, a finibus augue volutpat in.\n' +
                            '\n',
                        number: 5,
                        float: 0.6532453,
                        array: ['one', 'two', 'three', 'four', 'five'],
                        true: true,
                        false: false,
                    }
                }
            },
            {
                string:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque convallis leo orci, in lobortis nisi accumsan sit amet. Pellentesque ac ultricies augue. Donec malesuada justo quis purus dictum, nec dapibus neque elementum. Mauris tempus sem sed vestibulum volutpat. In sed aliquam mauris. Curabitur accumsan leo tempus rhoncus porta. Mauris lorem lectus, bibendum consectetur mauris ut, pulvinar ultricies leo. Vestibulum eget accumsan ante. Nulla blandit nulla at ex ornare eleifend. Pellentesque non justo in nunc ullamcorper porttitor. Cras tempor nulla lectus, a finibus augue volutpat in.\n' +
                    '\n',
                number: 5,
                float: 0.6532453,
                array: ['one', 'two', 'three', 'four', 'five'],
                true: true,
                false: false,
            },
        ],
    });

    return (
        <div className={styles.root}>
            <Loading isLoading={isFetching} />

            <h2 className={styles.variableName}>{data.result.name}
                {useOptions && <Button size="compact-xs" component={Link}
                         to={`${useOptions.getState().paths.update}/${data.result.id}/${data.result.locale}`}>Edit</Button>}
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
                                {data.result.shortID}{' '}
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
