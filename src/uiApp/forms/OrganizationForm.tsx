import InputText from '@app/uiComponents/inputs/InputText';
import { Grid } from '@mantine/core';
import { InputSelectControlled } from '@app/uiComponents/inputs/InputSelectControlled';
import MapsForm from '@app/uiComponents/mapsForm/MapsForm';
interface Props {
    structureName: string;
    mode?: 'update';
}
export default function OrganizationForm({ structureName, mode }: Props) {
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
            inputs={(submitButton, { inputBehaviour }) => (
                <>
                    <Grid>
                        <Grid.Col span={12}>
                            <InputText
                                label="Name"
                                name="name"
                                options={{
                                    required: 'Organization name is required',
                                }}
                            />
                        </Grid.Col>

                        <Grid.Col span={12}>{inputBehaviour()}</Grid.Col>
                    </Grid>

                    {submitButton}
                </>
            )}
        />
    );
}
