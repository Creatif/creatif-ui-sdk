import { Form } from '../../../src/app/uiComponents/form/Form';
import css from './css/root.module.css';
import { InputText } from '../../../src';
import { Grid } from '../../../src/app/layouts/Grid';
import { Cell } from '../../../src/app/layouts/Cell';
import { File } from '../../../src/app/uiComponents/inputs/fileUpload/File';
import { ManagersArrayInput } from './ManagersArrayInput';
export function ManagerForm() {
    return (
        <Form<{
            name: string;
            lastName: string;
            address: string;
            city: string;
            postalCode: string;
            managers: unknown[];
        }>
            bindings={{
                name: (values) => `${values.name}-${values.lastName}-${values.address}-${values.city}`,
            }}
            formProps={{
                defaultValues: {
                    name: '',
                    lastName: '',
                    address: '',
                    city: '',
                    postalCode: '',
                    managers: [],
                },
            }}
            inputs={(submitButton, {inputFile, inputConnection}) => (
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
                                options={{
                                    required: 'Last name is required',
                                }}
                            />
                        </Cell>

                        <Cell span="span 4">
                            <InputText
                                label="City"
                                name="city"
                                options={{
                                    required: 'Last name is required',
                                }}
                            />
                        </Cell>

                        <Cell span="span 4">
                            <InputText
                                label="Postal code"
                                name="postalCode"
                                options={{
                                    required: 'Last name is required',
                                }}
                            />
                        </Cell>

                        <Cell span="span 12">
                            <ManagersArrayInput name="managers" inputConnection={inputConnection} />
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
