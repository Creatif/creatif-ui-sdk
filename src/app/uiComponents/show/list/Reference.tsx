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

    const structureType = relationshipType === 'parent' ? reference.parentType : reference.childType;

    return (
        <>
            {relationshipType && structureType && (
                <List reference={reference} relationshipType={relationshipType} structureType={structureType} />
            )}
        </>
    );
}
