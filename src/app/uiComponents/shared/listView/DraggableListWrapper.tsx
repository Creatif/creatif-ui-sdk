import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableList from '@app/uiComponents/shared/listView/DraggableList';
import Item from '@app/uiComponents/lists/list/Item';
import React, { useState } from 'react';
import type { PaginationResult } from '@root/types/api/list';
import { PaginatedVariableResult } from '@root/types/api/list';
import DeleteModal from '@app/uiComponents/shared/DeleteModal';

interface Props<Value, Metadata> {
    data: PaginationResult<Value, Metadata>;
    structureName: string;
}

export default function DraggableListWrapper<Value, Metadata>({ data, structureName }: Props<Value, Metadata>) {
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
    const [areItemsDeleting, setAreItemsDeleting] = useState(false);

    return (
        <>
            <DndProvider backend={HTML5Backend}>
                <DraggableList<Value, Metadata>
                    data={data}
                    listName={structureName}
                    renderItems={(onDrop, onMove, list, hoveredId, movingSource, movingDestination) => (
                        <>
                            {list.map((item, i) => (
                                <Item
                                    onMove={onMove}
                                    onDrop={onDrop}
                                    isHovered={item.id === hoveredId}
                                    onChecked={(itemId, checked) => {
                                        const idx = checkedItems.findIndex((item) => item === itemId);
                                        if (idx !== -1 && !checked) {
                                            checkedItems.splice(idx, 1);
                                            setCheckedItems([...checkedItems]);
                                            return;
                                        }

                                        if (checked) {
                                            setCheckedItems([...checkedItems, itemId]);
                                        }
                                    }}
                                    onDeleted={() => invalidateQuery()}
                                    disabled={Boolean(
                                        (areItemsDeleting && checkedItems.includes(item.id)) ||
                                            (movingSource && movingSource === item.id) ||
                                            (movingDestination && movingDestination === item.id),
                                    )}
                                    key={item.id}
                                    index={i}
                                    item={item}
                                    listName={listName}
                                />
                            ))}
                        </>
                    )}
                />
            </DndProvider>

            <DeleteModal
                open={isDeleteAllModalOpen}
                message="Are you sure? This action cannot be undone and these items will be deleted permanently!"
                onClose={() => setIsDeleteAllModalOpen(false)}
                onDelete={() => {
                    setAreItemsDeleting(true);
                    setIsDeleteAllModalOpen(false);
                    deleteItemsByRange({
                        items: checkedItems,
                        name: listName,
                    });
                }}
            />
        </>
    );
}
