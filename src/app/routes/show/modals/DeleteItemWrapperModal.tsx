import DeleteModal from '@app/uiComponents/shared/modals/DeleteModal';
import useDeleteVariable from '@app/uiComponents/lists/hooks/useDeleteVariable';
import useNotification from '@app/systems/notifications/useNotification';
import type { StructureType } from '@root/types/shell/shell';
import type { ApiError } from '@lib/http/apiError';

interface Props {
    structureId: string;
    isOpen: boolean;
    structureType: StructureType;
    itemId: string;
    onClose: () => void;
    onDeleted: (error?: ApiError) => void;
}

export function DeleteItemWrapperModal({ isOpen, structureId, itemId, structureType, onClose, onDeleted }: Props) {
    const { success, error } = useNotification();

    const { mutate: deleteVariable } = useDeleteVariable(
        structureType,
        () => {
            success('List item deleted.', 'List item was deleted successfully');
            onDeleted();
        },
        (err) => {
            if (err.error.data.isParent) {
                error(
                    'Item could not be deleted',
                    'This item is a parent to another item. Delete the parent item first in order to delete this one.',
                );
                onClose();
                return;
            }

            error('Item could not be deleted', 'Something wrong happened. Please, try again later.');
            onClose();
        },
    );

    return (
        <DeleteModal
            message="Are you sure? This action cannot be undone and this item will be permanently deleted."
            open={isOpen}
            onClose={onClose}
            onDelete={() => {
                deleteVariable({
                    name: structureId,
                    itemId: itemId,
                });
            }}
        />
    );
}
