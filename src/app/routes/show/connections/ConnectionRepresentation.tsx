import type { ChildStructure } from '@root/types/api/shared';

interface Props {
    structure: ChildStructure;
    variableId: string;
}

export function ConnectionRepresentation({ structure, variableId }: Props) {
    return (
        <div>
            <p>{structure.structureType}</p>
            <p>{structure.structureName}</p>
            <p>{structure.structureId}</p>
            <p>{variableId}</p>
        </div>
    );
}
