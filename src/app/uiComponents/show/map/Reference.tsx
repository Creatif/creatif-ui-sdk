import type { QueryReference } from '@root/types/api/reference';
import { List } from '@app/uiComponents/show/referenceListing/List';

interface Props {
    reference: QueryReference;
    itemId: string;
}
export default function Reference({ reference, itemId }: Props) {
    const relationshipType = reference.parentId !== itemId ? 'child' : 'parent';
    const structureType = relationshipType === 'parent' ? reference.parentType : reference.childType;
    return <List reference={reference} relationshipType={relationshipType} structureType={structureType} />;
}
