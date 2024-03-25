import { Grid } from '@mantine/core';
import { InputText } from '../../src/app/uiComponents/inputs/InputText';
import Form from '../../src/app/uiComponents/form/Form';
export default function DeckForm() {
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
            inputs={(submitButton, { inputReference }) => (
                <>
                    <Grid>
                        <Grid.Col span={6}>
                            <InputText
                                label="Deck name"
                                name="name"
                                options={{
                                    required: 'Color name is required',
                                }}
                            />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            {inputReference({
                                name: 'language',
                                structureName: 'Languages',
                                structureType: 'list',
                                label: 'Language',
                            })}
                        </Grid.Col>
                    </Grid>

                    {submitButton}
                </>
            )}
        />
    );
}
