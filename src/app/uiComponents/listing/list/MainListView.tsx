import Item from '@app/uiComponents/listing/list/Item';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/listing/list/css/ListTable.module.css';
import type { PaginationResult } from '@lib/api/declarations/types/listTypes';
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
    return (
        <>
            {data && data.total !== 0 && (
                <>
                    {data.data.map((item) => (
                        <Item
                            onChecked={onChecked}
                            onDeleted={onDeleted}
                            disabled={disabled.areItemsDeleting && disabled.checkedItems.includes(item.id)}
                            key={item.id}
                            item={item}
                            listName={listName}
                        />
                    ))}
                </>
            )}
        </>
    );
}
