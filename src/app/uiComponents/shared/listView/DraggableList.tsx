import type React from 'react';
import { useEffect, useCallback, useState } from 'react';
import type rearrange from '@lib/api/declarations/lists/rearrange';
import useNotification from '@app/systems/notifications/useNotification';
import type { StructureItem } from '@app/systems/stores/projectMetadataStore';
import { Runtime } from '@app/systems/runtime/Runtime';
import type { PaginatedVariableResult } from '@root/types/api/list';

type OnDrop = (source: DragItem, destination: DragItem) => void;
type OnMove = (dragIndex: number, hoverIdx: number) => void;
export interface DragItem {
    index: number;
    id: string;
    name: string;
}
interface Props<Value, Metadata> {
    data: PaginatedVariableResult<Value, Metadata>[];
    structureItem: StructureItem;
    structureType: 'list' | 'map';
    onRearrange: typeof rearrange;
    sortingDirection: 'desc' | 'asc' | undefined;
    renderItems: (
        onDrop: OnDrop,
        onMove: OnMove,
        list: PaginatedVariableResult<Value, Metadata>[],
        hoveredId: string,
        movingSource: string | undefined,
        movingDestination: string | undefined,
    ) => React.ReactNode;
}
export default function DraggableList<Value, Metadata>({
    data,
    structureItem,
    structureType,
    renderItems,
    onRearrange,
    sortingDirection,
}: Props<Value, Metadata>) {
    const [list, setList] = useState<PaginatedVariableResult<Value, Metadata>[]>(data);
    const [hoveredId, setHoveredId] = useState<string>('');
    const [movingItems, setMovingItems] = useState<string[] | undefined>(undefined);
    const { error: errorNotification } = useNotification();

    useEffect(() => {
        setList(data);
    }, [data]);

    const onDrop = useCallback(
        (source: DragItem, destination: DragItem) => {
            // there must always be a sorting direction
            // because the backend relies on it
            if (!sortingDirection) return;

            if (source.index === destination.index) {
                setHoveredId('');
                setMovingItems(undefined);
                return;
            }

            setHoveredId('');
            setMovingItems([source.id, destination.id]);

            onRearrange(
                {
                    projectId: Runtime.instance.currentProjectCache.getProject().id,
                    name: structureItem.id,
                    source: source.id,
                    destination: destination.id,
                    orderDirection: sortingDirection,
                },
                structureType,
            ).then(({ result, error }) => {
                setMovingItems(undefined);

                if (error) {
                    errorNotification(
                        'Something went wrong.',
                        'This list could not be rearranged at this moment. Please, try again later.',
                    );

                    return;
                }

                if (result) {
                    const tempList = [...list];
                    const sourceIdx = tempList.findIndex((t) => t.id === source.id);
                    if (sourceIdx !== -1) {
                        const t = tempList[sourceIdx];

                        t.index = result;
                        if (sortingDirection === 'desc') {
                            tempList.sort((a, b) => b.index - a.index);
                            setList(tempList);
                            return;
                        }

                        tempList.sort((a, b) => a.index - b.index);
                        setList(tempList);
                        return;
                    }
                }
            });
        },
        [list, sortingDirection],
    );

    const onMove = useCallback(
        (dragIndex: number, hoverIndex: number) => {
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

    return renderItems(onDrop, onMove, list, hoveredId, movingItems && movingItems[0], movingItems && movingItems[1]);
}
