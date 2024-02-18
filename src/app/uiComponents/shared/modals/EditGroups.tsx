// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shared/css/modal.module.css';
import { Button, Modal, MultiSelect } from '@mantine/core';
import { useEffect, useState } from 'react';
import useGetGroups from '@app/uiComponents/shared/hooks/useGetGroups';
import useGetVariableGroups from '@app/uiComponents/shared/hooks/useGetVariableGroups';
import type { Group } from '@root/types/api/groups';
import { NativeSelectOption } from '@mantine/core/lib/components/NativeSelect/NativeSelectOption';

interface Props {
    open: boolean;
    onClose: () => void;
    onEdit: (groups: string[]) => void;
    structureType: string;
    itemId: string;
    structureName: string;
}

function createOptions(groups: Group[]) {
    return groups.map((item) => ({
        value: item.id,
        label: item.name,
    }));
}

export default function EditGroups({ open, onClose, onEdit, structureName, structureType, itemId }: Props) {
    const [groups, setGroups] = useState<string[]>([]);
    const { isFetching: areGroupsLoading, data: allGroups, error: groupError } = useGetGroups(open);
    const {
        isFetching: areVariableGroupsLoading,
        data: variableGroups,
        error: variableGroupsError,
    } = useGetVariableGroups(structureType, structureName, itemId, open);

    useEffect(() => {
        if (variableGroups?.result && allGroups?.result) {
            const vGroups = variableGroups.result;
            const gs = allGroups.result;

            setGroups(() =>
                vGroups
                    .filter((item) => {
                        const foundGroup = gs.find((t) => item.id === t.id);
                        if (foundGroup) {
                            return {
                                value: foundGroup.id,
                                name: foundGroup.name,
                            };
                        }
                    })
                    .map((item) => item.id),
            );
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
                    data={createOptions(allGroups?.result || [])}
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
