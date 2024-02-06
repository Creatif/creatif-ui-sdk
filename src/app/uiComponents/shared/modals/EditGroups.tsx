// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shared/css/modal.module.css';
import { Button, Modal, MultiSelect } from '@mantine/core';
import { useEffect, useState } from 'react';
import useGetGroups from '@app/uiComponents/shared/hooks/useGetGroups';
import useGetVariableGroups from '@app/uiComponents/shared/hooks/useGetVariableGroups';

interface Props {
    open: boolean;
    onClose: () => void;
    onEdit: (groups: string[]) => void;
    currentGroups: string[];
    structureType: string;
    itemId: string;
    structureName: string;
}

export default function EditGroups({
    open,
    onClose,
    onEdit,
    currentGroups,
    structureName,
    structureType,
    itemId,
}: Props) {
    const [groups, setGroups] = useState<string[]>(currentGroups);
    const { isFetching: areGroupsLoading, data: allGroups, error: groupError } = useGetGroups(open);
    const {
        isFetching: areVariableGroupsLoading,
        data: variableGroups,
        error: variableGroupsError,
    } = useGetVariableGroups(structureType, structureName, itemId, open);

    useEffect(() => {
        if (variableGroups) {
            setGroups((variableGroups && variableGroups.result) || []);
        }
    }, [variableGroups]);

    const isError = Boolean(groupError) || areGroupsLoading || areVariableGroupsLoading || Boolean(variableGroupsError);

    return (
        <>
            <Modal opened={Boolean(open)} onClose={onClose} centered>
                <p className={styles.informationParagraph}>
                    Groups allow you to group your items any way you like. Groups are collected from all your created
                    structures so you can select any group that you previously assigned to some other structure.
                </p>

                <MultiSelect
                    disabled={areGroupsLoading || areVariableGroupsLoading}
                    placeholder="Choose your groups"
                    clearable={true}
                    value={groups}
                    data={(allGroups && allGroups.result) || []}
                    onChange={(groups) => {
                        setGroups(groups);
                    }}
                />

                <div className={styles.buttonGroup}>
                    <Button onClick={onClose} variant="light" color="gray">
                        Cancel
                    </Button>

                    <Button disabled={isError} onClick={() => onEdit(groups)}>
                        Edit
                    </Button>
                </div>
            </Modal>
        </>
    );
}
