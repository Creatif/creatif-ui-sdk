import { getOptions } from '@app/systems/stores/options';
import DeleteModal from '@app/uiComponents/lists/list/DeleteModal';
import GroupsPopover from '@app/uiComponents/lists/list/GroupsPopover';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/variables/css/VariableDisplay.module.css';
import deleteVariable from '@lib/api/declarations/variables/deleteVariable';
import { Button, Pill } from '@mantine/core';
import { IconEdit, IconReplace, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Behaviour } from '@root/types/api/shared';
import { Initialize } from '@app/initialize';
import useDeleteVariable from '@lib/api/hooks/useDeleteVariable';

interface Props {
    name: string;
    behaviour: Behaviour;
    groups: string[] | undefined;
    shortId: string;
    structureName: string;
}

export default function InfoSection({ name, behaviour, groups, shortId, structureName }: Props) {
    const useVariableOptions = getOptions(structureName);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { mutate, isLoading } = useDeleteVariable(structureName);

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
                    disabled={isLoading}
                    component={Link}
                    to={`${useVariableOptions.getState().paths.update}/${shortId}`}
                    leftSection={<IconEdit size={16} />}>
                    Edit
                </Button>
                <Button
                    disabled={isLoading}
                    loading={isLoading}
                    loaderProps={{ size: 16 }}
                    onClick={() => setIsDeleteModalOpen(true)}
                    leftSection={<IconTrash size={16} />}
                    color="red">
                    Delete
                </Button>
            </div>

            <DeleteModal
                open={isDeleteModalOpen}
                message="Are you sure you want to delete this variable? This action is permanent and cannot be undone."
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={async () => {
                    mutate({
                        name: structureName,
                        projectId: Initialize.ProjectID(),
                    });

                    setIsDeleteModalOpen(false);
                }}
            />
        </section>
    );
}
