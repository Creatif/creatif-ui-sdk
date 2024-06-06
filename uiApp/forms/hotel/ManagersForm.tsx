import Form from '../../../src/app/uiComponents/form/Form';
import { Grid, Group } from '@mantine/core';
import { InputText, InputSelectControlled } from '../../../src';

export function ManagersForm() {
    return (
        <Form<{
            name: string;
            lastName: string;
            managerType: string;
        }>
            bindings={{
                name: (values) => `${values.name} ${values.lastName}`,
            }}
            formProps={{
                defaultValues: {
                    name: '',
                    lastName: '',
                    managerType: '',
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

                        <Grid.Col span={6}>
                            <InputText
                                label="Last name"
                                name="lastName"
                                options={{
                                    required: 'Last name is required',
                                }}
                            />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <InputSelectControlled
                                label="Manager type"
                                name="managerType"
                                data={['Local', 'Municipal', 'Regional']}
                                validation={{
                                    required: 'Manager type is required',
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
