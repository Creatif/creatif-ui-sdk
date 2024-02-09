import Item from '@app/uiComponents/variables/Item';
import type { PaginationResult } from '@root/types/api/list';
import type { StructureItem } from '@app/systems/stores/projectMetadataStore';
interface Props<Value, Metadata> {
    data: PaginationResult<Value, Metadata>;
    onDeleted: () => void;
    structureItem: StructureItem;
}
export default function MainListView<Value, Metadata>({ data, onDeleted, structureItem }: Props<Value, Metadata>) {
    return (
        <>
            {data.data.map((item) => (
                <Item structureItem={structureItem} onDeleted={onDeleted} key={item.id} item={item} />
            ))}
        </>
    );
}
