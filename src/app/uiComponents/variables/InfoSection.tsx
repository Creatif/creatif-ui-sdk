import { getOptions } from '@app/systems/stores/options';
import GroupsPopover from '@app/uiComponents/lists/list/GroupsPopover';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/variables/css/VariableDisplay.module.css';
import { Button, Pill } from '@mantine/core';
import { IconEdit, IconReplace, IconTrash } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import type { Behaviour } from '@root/types/api/shared';

interface Props {
    name: string;
    behaviour: Behaviour;
    groups: string[];
    shortId: string;
    structureName: string;
}

export default function InfoSection({ name, behaviour, groups, shortId, structureName }: Props) {
    const useVariableOptions = getOptions(structureName);

    return (
        <section className={styles.informationRoot}>
            <div className={styles.info}>
                <p className={styles.name}>{name}</p>
                <p className={styles.behaviour}>
                    <IconReplace
                        className={behaviour === 'modifiable' ? styles.modifiable : styles.readonly}
                        size={20}
                    />
                    <span>{behaviour === 'modifiable' ? 'Modifiable' : 'Readonly'}</span>
                </p>

                {groups && (
                    <div className={styles.groups}>
                        {groups.slice(0, 3).map((item) => (
                            <Pill
                                key={item}
                                styles={{
                                    root: { backgroundColor: 'var(--mantine-color-blue-0)' },
                                    label: { cursor: 'pointer' },
                                }}>
                                {item}
                            </Pill>
                        ))}

                        <GroupsPopover groups={groups} />
                    </div>
                )}
            </div>

            <div className={styles.actionButtonGroup}>
                <Button
                    component={Link}
                    to={`${useVariableOptions.getState().paths.update}/${shortId}`}
                    leftSection={<IconEdit size={16} />}>
                    Edit
                </Button>
                <Button leftSection={<IconTrash size={16} />} color="red">
                    Delete
                </Button>
            </div>
        </section>
    );
}
