import InputText from '@app/uiComponents/inputs/InputText';
import { Grid } from '@mantine/core';
import MapsForm from '@app/uiComponents/mapsForm/MapsForm';
interface Props {
    mode?: 'update';
}
export default function DeckForm({ mode }: Props) {
    return (
        <MapsForm<{
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
                                structureType: 'map',
                                placeholder: 'Languages',
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
