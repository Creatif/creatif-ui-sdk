import Item from '@app/uiComponents/lists/list/Item';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { PaginatedVariableResult, PaginationResult } from '@root/types/api/list';
import { useCallback, useState } from 'react';
import rearrange from '@lib/api/declarations/lists/rearrange';
import { Initialize } from '@app/initialize';
import useNotification from '@app/systems/notifications/useNotification';
import { useQueryClient } from 'react-query';

export interface DragItem {
    index: number;
    id: string;
    name: string;
}
interface Props<Value, Metadata> {
    data: PaginationResult<Value, Metadata>;
    onChecked: (itemId: string, checked: boolean) => void;
    onDeleted: () => void;
    listName: string;
    disabled: {
        areItemsDeleting: boolean;
        checkedItems: string[];
    };
}
export default function MainListView<Value, Metadata>({
    data,
    onChecked,
    onDeleted,
    listName,
    disabled,
}: Props<Value, Metadata>) {
    const [list, setList] = useState<PaginatedVariableResult[]>(data.data);
    const [hoveredId, setHoveredId] = useState<string>('');
    const [movingItems, setMovingItems] = useState<string[] | undefined>(undefined);
    const { error: errorNotification } = useNotification();
    const queryClient = useQueryClient();

    const onDrop = useCallback(
        (source: DragItem, destination: DragItem) => {
            console.log('on drop');
            if (source.index === destination.index) {
                setHoveredId('');
                setMovingItems(undefined);
                return;
            }

            setHoveredId('');
            setMovingItems([source.id, destination.id]);

            rearrange({
                projectId: Initialize.ProjectID(),
                name: listName,
                source: source.id,
                destination: destination.id,
            }).then(({ error }) => {
                setMovingItems(undefined);

                if (error) {
                    errorNotification(
                        'Something went wrong.',
                        'This list could not be rearranged at this moment. Please, try again later.',
                    );

                    return;
                }

                queryClient.invalidateQueries([listName]);
            });
        },
        [list],
    );

    const onMove = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            console.log('on move');
            if (list[hoverIndex]) {
                setHoveredId(list[hoverIndex].id);
                setMovingItems(undefined);
                return;
            }

            setHoveredId('');
            setMovingItems(undefined);
        },
        [list],
    );

    return (
        <div>
            {list.map((item, i) => (
                <Item
                    onMove={onMove}
                    onDrop={onDrop}
                    isHovered={item.id === hoveredId}
                    onChecked={onChecked}
                    onDeleted={onDeleted}
                    disabled={
                        (disabled.areItemsDeleting && disabled.checkedItems.includes(item.id)) ||
                        (movingItems && movingItems[0] === item.id) ||
                        (movingItems && movingItems[1] === item.id)
                    }
                    key={item.id}
                    index={i}
                    item={item}
                    listName={listName}
                />
            ))}
        </div>
    );
}
