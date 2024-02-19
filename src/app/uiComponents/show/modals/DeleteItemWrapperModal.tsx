import DeleteModal from '@app/uiComponents/shared/modals/DeleteModal';
import deleteVariable from '@lib/api/declarations/variables/deleteVariable';
import useDeleteVariable from '@app/uiComponents/lists/hooks/useDeleteVariable';
import useNotification from '@app/systems/notifications/useNotification';
import { StructureType } from '@root/types/shell/shell';
import { ApiError } from '@lib/http/apiError';

interface Props {
    deleteItemId: string;
    structureId: string;
    isOpen: boolean;
    structureType: StructureType;
    itemId: string;
    onClose: () => void;
    onDeleted: (error?: ApiError) => void;
}

export function DeleteItemWrapperModal({deleteItemId, isOpen, structureId, itemId, structureType, onClose, onDeleted}: Props) {
    const {success, error} = useNotification();

    const { mutate: deleteVariable } = useDeleteVariable(
        structureType,
        () => {
            success('List item deleted.', 'List item was deleted successfully');
            onDeleted();
        },
        () => {
            error('Item could not be deleted', 'Something wrong happened. Please, try again later.');
            onClose();
        },
    );

    return <DeleteModal
        message="Are you sure? This action cannot be undone and this item will be permanently deleted."
        open={isOpen}
        onClose={onClose}
        onDelete={() => {
            deleteVariable({
                name: structureId,
                itemId: itemId,
            });
        }}
    />;
}