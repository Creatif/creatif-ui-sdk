// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shared/css/Item.module.css';
import { Tooltip } from '@mantine/core';
import { IconCalendarTime, IconEyeOff, IconReplace } from '@tabler/icons-react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import type { PaginatedVariableResult } from '@root/types/api/list';
import Groups from '@app/components/Groups';
import appDate from '@lib/helpers/appDate';
import type { StructureItem } from '@app/systems/stores/projectMetadataStore';
interface Props<Value, Metadata> {
    item: PaginatedVariableResult<Value, Metadata>;
    structureItem: StructureItem;
    isHovered: boolean;
}
export default function Item<Value, Metadata>({ item, structureItem, isHovered }: Props<Value, Metadata>) {
    return (
        <Link
            to={`${structureItem.navigationShowPath}/${structureItem.id}/${item.id}`}
            className={classNames(styles.item, isHovered ? styles.hovered : undefined)}>
            <div className={styles.visibleSectionWrapper}>
                <div className={styles.infoColumn}>
                    <div className={styles.nameRow}>
                        <div className={styles.information}>
                            {item.name.length > 20 && (
                                <Tooltip w={320} transitionProps={{ duration: 200 }} multiline label={item.name}>
                                    <h2 className={styles.nameRowTitle}>{item.name.substring(0, 20)}...</h2>
                                </Tooltip>
                            )}

                            {item.name.length < 20 && <h2 className={styles.nameRowTitle}>{item.name}</h2>}

                            <div className={styles.behaviour}>
                                {item.behaviour === 'modifiable' && (
                                    <IconReplace color="var(--mantine-color-gray-8)" size={14} />
                                )}
                                {item.behaviour === 'readonly' && (
                                    <IconEyeOff color="var(--mantine-color-gray-8)" size={14} />
                                )}
                                <p>{item.behaviour === 'modifiable' ? 'Modifiable' : 'Readonly'}</p>
                            </div>

                            <Groups groups={item.groups || []} />

                            <div className={styles.behaviour}>
                                <span className={styles.localeStrong}>{item.locale}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.createdAt}>
                        <IconCalendarTime size={16} color="var(--mantine-color-gray-7)" /> {appDate(item.createdAt)}
                    </div>
                </div>

                <div className={styles.menu} />
            </div>
        </Link>
    );
}
