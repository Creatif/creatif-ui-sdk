import InputText from '@app/uiComponents/inputs/InputText';
import { Grid } from '@mantine/core';
import Form from '@app/uiComponents/form/Form';
interface Props {
    mode?: 'update';
}
export default function LanguageForm({ mode }: Props) {
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
