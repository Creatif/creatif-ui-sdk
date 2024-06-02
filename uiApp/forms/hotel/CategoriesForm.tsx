import Form from '../../../src/app/uiComponents/form/Form';
import { Grid, Group } from '@mantine/core';
import { InputText, InputSelectControlled } from '../../../src';

export function CategoriesForm() {
    return (
        <Form<{
            name: string;
        }>
            bindings={{
                name: (values) => values.name,
            }}
            formProps={{
                defaultValues: {
                    name: '',
                },
            }}
            inputs={(submitButton) => (
                <>
                    <Grid>
                        <Grid.Col span={6}>
                            <InputText
                                label="Name"
                                name="name"
                                options={{
                                    required: 'Name is required',
                                }}
                            />
                        </Grid.Col>
                    </Grid>

                    <Group
                        align="center"
                        justify="flex-end"
                        style={{
                            marginTop: '1rem',
                        }}>
                        {submitButton}
                    </Group>
                </>
            )}
        />
    );
}
