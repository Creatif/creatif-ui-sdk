import InputText from '@app/uiComponents/inputs/InputText';
import { Grid } from '@mantine/core';
import ListForm from '@app/uiComponents/listForm/ListForm';
interface Props {
    mode?: 'update';
}
export default function LanguageForm({ mode }: Props) {
    return (
        <ListForm<{
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
                                label="Language name"
                                name="name"
                                options={{
                                    required: 'Language name is required',
                                }}
                            />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            {inputReference({
                                name: 'deck',
                                structureName: 'Decks',
                                structureType: 'map',
                                placeholder: 'Search for decks',
                                validation: {
                                    required: 'Decks is required',
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
