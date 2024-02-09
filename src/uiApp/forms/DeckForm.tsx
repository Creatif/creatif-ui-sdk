import InputText from '@app/uiComponents/inputs/InputText';
import { Grid } from '@mantine/core';
import Form from '@app/uiComponents/form/Form';
interface Props {
    mode?: 'update';
}
export default function DeckForm({ mode }: Props) {
    return (
        <Form<{
            name: string;
        }>
            mode={mode}
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
                                validation: {
                                    required: 'Language is required',
                                },
                            })}
                        </Grid.Col>
                    </Grid>

                    {submitButton}
                </>
            )}
        />
    );
}
