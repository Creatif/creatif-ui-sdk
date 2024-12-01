import type { QueryConnection } from '@root/types/api/connections';
import { List } from '@app/routes/show/referenceListing/List';

interface Props {
    reference: QueryConnection;
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
