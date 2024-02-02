import InputText from '@app/uiComponents/inputs/InputText';
import { Grid } from '@mantine/core';
import MapsForm from '@app/uiComponents/mapsForm/MapsForm';
interface Props {
    mode?: 'update';
}
export default function OrganizationForm({ mode }: Props) {
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
            inputs={(submitButton, { inputBehaviour, inputReference }) => (
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

                        <Grid.Col span={12}>
                            {inputReference({
                                name: 'attributes',
                                structureName: 'Attributes',
                                structureType: 'map',
                                placeholder: 'Attributes',
                                validation: {
                                    required: 'Attributes is required',
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
