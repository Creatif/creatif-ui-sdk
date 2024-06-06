import Form from '../../../src/app/uiComponents/form/Form';
import { Grid, Group } from '@mantine/core';
import { InputText, InputSelectControlled } from '../../../src';

export function RegionsForm() {
    return (
        <Form<{
            name: string;
            priority: string;
        }>
            bindings={{
                name: (values) => values.name,
            }}
            formProps={{
                defaultValues: {
                    name: '',
                    priority: 'Medium',
                },
            }}
            inputs={(submitButton, { inputReference, inputGroups }) => (
                <>
                    <Grid>
                        <Grid.Col span={6}>
                            <InputText
                                label="Region name"
                                name="name"
                                options={{
                                    required: 'Region name is required',
                                }}
                            />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <InputSelectControlled
                                description="Is this region a high priority to the management?"
                                label="Priority"
                                name="priority"
                                data={['High', 'Medium', 'Low']}
                                defaultValue="Medium"
                            />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            {inputReference({
                                name: 'manager',
                                structureName: 'Managers',
                                structureType: 'map',
                            })}
                        </Grid.Col>

                        <Grid.Col span={6}>{inputGroups()}</Grid.Col>
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
