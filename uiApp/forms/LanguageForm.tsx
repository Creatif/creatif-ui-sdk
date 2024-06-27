import { Grid } from '@mantine/core';
import { InputText } from '../../src/app/uiComponents/inputs/InputText';
import { Form } from '../../src/app/uiComponents/form/Form';
import { Image } from './Image';

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
                            <Image name='file1' inputImage={inputImage} />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <Image name='file2' inputImage={inputImage} />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <Image name='file3' inputImage={inputImage} />

                        </Grid.Col>

                        <Grid.Col span={6}>
                            <Image name='file4' inputImage={inputImage} />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <Image name='file5' inputImage={inputImage} />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <Image name='file6' inputImage={inputImage} />
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
