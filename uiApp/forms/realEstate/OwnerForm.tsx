import { Form } from '../../../src/app/uiComponents/form/Form';
import { OwnerInformation } from './components/OwnerInformation';
export function OwnerForm() {
    return (
        <Form<{
            name: string;
            lastName: string;
            address: string;
            city: string;
            postalCode: string;
        }>
            bindings={{
                name: (values) => `${values.name}-${values.lastName}-${values.address}`,
            }}
            formProps={{
                defaultValues: {
                    name: '',
                    lastName: '',
                    address: '',
                    city: '',
                    postalCode: '',
                },
            }}
            inputs={(submitButton) => (
                <>
                    <OwnerInformation />

                    {submitButton}
                </>
            )}
        />
    );
}
