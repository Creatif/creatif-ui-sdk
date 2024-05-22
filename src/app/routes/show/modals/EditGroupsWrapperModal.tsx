import EditGroups from '@app/uiComponents/shared/modals/EditGroups';
import useUpdateVariable from '@app/uiComponents/lists/hooks/useUpdateVariable';
import type { StructureItem } from '@app/systems/stores/projectMetadataStore';
import { useEffect } from 'react';
import type { Group } from '@root/types/api/groups';

interface Props {
    isOpen: boolean;
    structureItem: StructureItem;

    id: string;
    name: string;
    currentLocale: string;

    onClose: () => void;
    onUpdated: (groups: Group[]) => void;
}

export function EditGroupsWrapperModal({ structureItem, id, isOpen, onClose, onUpdated, name }: Props) {
    const { mutate, data: updatedVariable } = useUpdateVariable(
        structureItem.structureType,
        structureItem.id,
        id,
        name,
    );

    useEffect(() => {
        if (updatedVariable?.result) {
            onUpdated(updatedVariable.result.groups);
            onClose();
        }
    }, [updatedVariable]);

    return (
        <EditGroups
            itemId={id}
            structureType={structureItem.structureType}
            structureName={structureItem.id}
            open={isOpen}
            onClose={onClose}
            onEdit={(groups) => {
                mutate({
                    values: {
                        groups: groups,
                    },
                    fields: ['groups'],
                });
            }}
        />
    );
}
