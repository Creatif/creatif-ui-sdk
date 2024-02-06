// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shared/css/modal.module.css';
import { Button, Modal, MultiSelect, Select } from '@mantine/core';
import { useState } from 'react';
import useGetGroups from '@app/uiComponents/shared/hooks/useGetGroups';
import MultiSelectWithAdd from '@app/uiComponents/inputs/fields/MultiSelectWithAdd';

interface Props {
    open: boolean;
    onClose: () => void;
    onEdit: (groups: string[]) => void;
    currentGroups: string[];
    structureType: string;
    structureName: string;
}

export default function EditGroups({ open, onClose, onEdit, currentGroups, structureName, structureType }: Props) {
    const [groups, setGroups] = useState<string[]>(currentGroups);
    const { isFetching: areGroupsLoading, data, error: groupError } = useGetGroups(structureType, structureName, open);

    return (
        <>
            <Modal opened={Boolean(open)} onClose={onClose} centered>
                <p className={styles.informationParagraph}>
                    Groups allow you to group your items any way you like. Groups are collected from all your created
                    structures so you can select any group that you previously assigned to some other structure.
                </p>

                <MultiSelect
                    disabled={areGroupsLoading}
                    placeholder="Choose your groups"
                    data={(data && data.result) || []}
                    onChange={(groups) => {
                        setGroups((current) => Array.from(new Set([...current, ...groups])));
                    }}
                />

                <div className={styles.buttonGroup}>
                    <Button onClick={onClose} variant="light" color="gray">
                        Cancel
                    </Button>

                    <Button disabled={Boolean(groupError) || areGroupsLoading} onClick={() => onEdit(groups)}>
                        Edit
                    </Button>
                </div>
            </Modal>
        </>
    );
}
