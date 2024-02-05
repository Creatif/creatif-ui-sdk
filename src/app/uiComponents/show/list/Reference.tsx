import type { QueryReference } from '@root/types/api/reference';
import { List } from '@app/uiComponents/show/referenceListing/List';

interface Props {
    reference: QueryReference;
    itemId: string;
}

export default function Reference({ reference, itemId }: Props) {
    let relationshipType = '';
    if (reference.parentId === itemId) {
        relationshipType = 'child';
    } else if (reference.childId === itemId) {
        relationshipType = 'parent';
    }

    console.log(itemId);
    console.log(reference);
    const structureType = relationshipType === 'parent' ? reference.parentType : reference.childType;

    console.log(relationshipType, structureType);
    return (
        <>
            {relationshipType && structureType && (
                <List reference={reference} relationshipType={relationshipType} structureType={structureType} />
            )}
        </>
    );
}
