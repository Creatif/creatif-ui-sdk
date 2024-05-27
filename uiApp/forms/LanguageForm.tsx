import { Grid } from '@mantine/core';
import { InputText } from '../../src/app/uiComponents/inputs/InputText';
import { Form } from '../../src/app/uiComponents/form/Form';

export default function LanguageForm() {
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
            inputs={(submitButton, { inputLocale, inputGroups, inputBehaviour }) => (
                <>
                    <Grid>
                        <Grid.Col span={6}>
                            <InputText
                                label="Language name"
                                name="name"
                                options={{
                                    required: 'Language name is required',
                                }}
                            />
                        </Grid.Col>

                        <Grid.Col span={6}>{inputGroups()}</Grid.Col>
                        <Grid.Col span={6}>{inputLocale()}</Grid.Col>
                        <Grid.Col span={6}>{inputBehaviour()}</Grid.Col>
                    </Grid>

                    {submitButton}
                </>
            )}
        />
    );
}
