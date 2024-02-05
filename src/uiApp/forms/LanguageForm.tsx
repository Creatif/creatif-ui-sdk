import InputText from '@app/uiComponents/inputs/InputText';
import { Grid } from '@mantine/core';
import MapsForm from '@app/uiComponents/mapsForm/MapsForm';
interface Props {
    mode?: 'update';
}
export default function LanguageForm({ mode }: Props) {
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
            inputs={(submitButton) => (
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
                    </Grid>

                    {submitButton}
                </>
            )}
        />
    );
}
