import Item from '@app/uiComponents/variables/Item';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { PaginationResult } from '@root/types/api/list';
interface Props<Value, Metadata> {
    data: PaginationResult<Value, Metadata>;
    onDeleted: () => void;
    name: string;
}
export default function MainListView<Value, Metadata>({ data, onDeleted, name }: Props<Value, Metadata>) {
    return (
        <>
            {data.data.map((item) => (
                <Item onDeleted={onDeleted} key={item.id} item={item} name={name} />
            ))}
        </>
    );
}
