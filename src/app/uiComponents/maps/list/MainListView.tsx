import Item from '@app/uiComponents/maps/list/Item';
import type { PaginationResult } from '@root/types/api/list';
interface Props<Value, Metadata> {
    data: PaginationResult<Value, Metadata>;
    onChecked: (itemId: string, checked: boolean) => void;
    onDeleted: () => void;
    mapName: string;
    disabled: {
        areItemsDeleting: boolean;
        checkedItems: string[];
    };
}
export default function MainListView<Value, Metadata>({
    data,
    onChecked,
    onDeleted,
    mapName,
    disabled,
}: Props<Value, Metadata>) {
    return (
        <div>
            {data.data.map((item, i) => (
                <Item
                    onChecked={onChecked}
                    onDeleted={onDeleted}
                    disabled={disabled.areItemsDeleting && disabled.checkedItems.includes(item.id)}
                    key={item.id}
                    item={item}
                    mapName={mapName}
                />
            ))}
        </div>
    );
}
