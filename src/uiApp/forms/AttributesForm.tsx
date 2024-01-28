import InputText from '@app/uiComponents/inputs/InputText';
import { Grid } from '@mantine/core';
import { InputSelectControlled } from '@app/uiComponents/inputs/InputSelectControlled';
import MapsForm from '@app/uiComponents/mapsForm/MapsForm';
interface Props {
    structureName: string;
    mode?: 'update';
}
export default function AttributesForm({ structureName, mode }: Props) {
    return (
        <MapsForm<{
            name: string;
        }>
            mode={mode}
            bindings={{
                name: (values) => values.name,
            }}
            mapName={structureName}
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
                                label="Attribute name"
                                name="name"
                                options={{
                                    required: 'Attribute name is required',
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
