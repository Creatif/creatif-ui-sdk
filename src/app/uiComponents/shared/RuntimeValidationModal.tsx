import RuntimeErrorModal from '@app/uiComponents/shared/RuntimeErrorModal';
import { ValidationMessages } from '@app/uiComponents/configValidation/ValidationMessages';

interface Props {
    validationMessages: string[];
}

export function RuntimeValidationModal({ validationMessages }: Props) {
    return (
        <RuntimeErrorModal
            open={true}
            error={{
                message: <ValidationMessages messages={validationMessages} theme="dark" />,
            }}
        />
    );
}
