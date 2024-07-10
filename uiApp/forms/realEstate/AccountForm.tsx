import { Form } from '../../../src/app/uiComponents/form/Form';
import css from './css/root.module.css';
import { InputText } from '../../../src';
import { Grid } from '../../../src/app/layouts/Grid';
import { Cell } from '../../../src/app/layouts/Cell';
import { File } from '../../../src/app/uiComponents/inputs/fileUpload/File';
export function AccountForm() {
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
            inputs={(submitButton, {inputFile}) => (
                <>
                    <Grid>
                        <Cell span="span 12">
                            <InputText
                                label="Name"
                                name="name"
                                options={{
                                    required: 'Name is required',
                                }}
                            />
                        </Cell>

                        <Cell span="span 12">
                            <InputText
                                label="Last name"
                                name="lastName"
                                options={{
                                    required: 'Last name is required',
                                }}
                            />
                        </Cell>

                        <Cell span="span 3">
                            <InputText
                                label="Address"
                                name="address"
                                options={{
                                    required: 'Address is required',
                                }}
                            />
                        </Cell>

                        <Cell span="span 3">
                            <InputText
                                label="City"
                                name="city"
                                options={{
                                    required: 'City is required',
                                }}
                            />
                        </Cell>

                        <Cell span="span 3">
                            <InputText
                                label="Postal code"
                                name="postalCode"
                                options={{
                                    required: 'City is required',
                                }}
                            />
                        </Cell>

                        <Cell span="span 12">
                            <File label="Profile image" inputFile={inputFile} name="profileImage" fileButtonProps={{
                                multiple: true,
                            }} />
                        </Cell>

                        <Cell span="span 12">
                            <File label="Profile image" inputFile={inputFile} name="profileImage1" />
                        </Cell>
                    </Grid>

                    <div className={css.submitButton}>{submitButton}</div>
                </>
            )}
        />
    );
}
