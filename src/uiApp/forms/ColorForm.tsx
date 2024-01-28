import InputText from '@app/uiComponents/inputs/InputText';
import { Grid } from '@mantine/core';
import MapsForm from '@app/uiComponents/mapsForm/MapsForm';
interface Props {
    structureName: string;
    mode?: 'update';
}
export default function ColorForm({ structureName, mode }: Props) {
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
            inputs={(submitButton, { inputReference }) => (
                <>
                    <Grid>
                        <Grid.Col span={6}>
                            <InputText
                                label="Color name"
                                name="name"
                                options={{
                                    required: 'Color name is required',
                                }}
                            />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            {inputReference({
                                name: 'color',
                                structureName: 'Attributes',
                                structureType: 'map',
                                placeholder: 'Attributes',
                                validation: {
                                    required: 'Color is required',
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
