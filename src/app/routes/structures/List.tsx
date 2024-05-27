import { Listing } from '@app/routes/structures/Listing';
import { RuntimeValidationModal } from '@app/uiComponents/shared/RuntimeValidationModal';

interface Props {
    validationMessages: string[] | null;
}

export default function List({ validationMessages }: Props) {
    return (
        <>
            <Listing structureType="map" />
            {validationMessages && <RuntimeValidationModal validationMessages={validationMessages} />}
        </>
    );
}
