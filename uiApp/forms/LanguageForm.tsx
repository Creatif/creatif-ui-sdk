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
            inputs={(submitButton, { inputLocale, inputGroups, inputBehaviour, inputImage }) => (
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

                        <Grid.Col span={6}>
                            {inputImage({
                                name: 'file1',
                            })}
                        </Grid.Col>

                        <Grid.Col span={6}>
                            {inputImage({
                                name: 'file2',
                            })}
                        </Grid.Col>

                        <Grid.Col span={6}>
                            {inputImage({
                                name: 'file3',
                            })}
                        </Grid.Col>

                        <Grid.Col span={6}>
                            {inputImage({
                                name: 'file4',
                            })}
                        </Grid.Col>

                        <Grid.Col span={6}>
                            {inputImage({
                                name: 'file5',
                            })}
                        </Grid.Col>

                        <Grid.Col span={6}>
                            {inputImage({
                                name: 'file6',
                            })}
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
