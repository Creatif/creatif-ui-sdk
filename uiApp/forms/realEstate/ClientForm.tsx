import { Form } from '../../../src/app/uiComponents/form/Form';
import css from './css/root.module.css';
import { InputText } from '../../../src';
import { Grid } from '../../../src/app/layouts/Grid';
import { Cell } from '../../../src/app/layouts/Cell';
import { File } from '../../../src/app/uiComponents/inputs/fileUpload/File';
export function ClientForm() {
    return (
        <Form<{
            name: string;
            lastName: string;
            address: string;
            city: string;
            postalCode: string;
        }>
            bindings={{
                name: (values) => `${values.name}-${values.lastName}`,
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
            inputs={(submitButton, {inputFile}) => (
                <>
                    <Grid>
                        <Cell span="span 6">
                            <InputText
                                label="Name"
                                name="name"
                                options={{
                                    required: 'Name is required',
                                }}
                            />
                        </Cell>

                        <Cell span="span 6">
                            <InputText
                                label="Last name"
                                name="lastName"
                                options={{
                                    required: 'Last name is required',
                                }}
                            />
                        </Cell>

                        <Cell span="span 4">
                            <InputText
                                label="Address"
                                name="address"
                            />
                        </Cell>

                        <Cell span="span 4">
                            <InputText
                                label="City"
                                name="city"
                            />
                        </Cell>

                        <Cell span="span 4">
                            <InputText
                                label="Postal code"
                                name="postalCode"
                            />
                        </Cell>

                        <Cell span="span 12">
                            <File label="Profile image" inputFile={inputFile} name="profileImage" fileButtonProps={{
                                accept: 'image/png,image/jpeg,image/jpg,image/gif,image/webp,image/avif'
                            }} />
                        </Cell>
                    </Grid>

                    <div className={css.submitButton}>{submitButton}</div>
                </>
            )}
        />
    );
}
