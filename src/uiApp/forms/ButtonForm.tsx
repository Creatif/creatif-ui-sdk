import InputText from '@app/uiComponents/inputs/InputText';
import { Grid } from '@mantine/core';
import { InputSelectControlled } from '@app/uiComponents/inputs/InputSelectControlled';
import MapsForm from '@app/uiComponents/mapsForm/MapsForm';
interface Props {
    structureName: string;
    mode?: 'update';
}
export default function ButtonForm({ structureName, mode }: Props) {
    return (
        <MapsForm<{
            text: string;
            name: string;
            variant: string;
            buttonType: string;
        }>
            mode={mode}
            bindings={{
                name: (values) => values.name,
            }}
            mapName={structureName}
            formProps={{
                defaultValues: {
                    text: '',
                    name: '',
                    variant: 'light',
                    buttonType: 'primary',
                },
            }}
            inputs={(submitButton, { inputBehaviour }) => (
                <>
                    <Grid>
                        <Grid.Col span={6}>
                            <InputText
                                label="Text"
                                name="text"
                                options={{
                                    required: 'Text is required',
                                }}
                            />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <InputText
                                label="Name"
                                name="name"
                                options={{
                                    required: 'Name is required',
                                }}
                            />
                        </Grid.Col>

                        <Grid.Col span={6}>{inputBehaviour()}</Grid.Col>

                        <Grid.Col span={6}>
                            <InputSelectControlled
                                label="Variant"
                                name="variant"
                                validation={{
                                    required: 'Name is required',
                                }}
                                data={[
                                    {
                                        value: 'filled',
                                        label: 'Filled',
                                    },
                                    {
                                        value: 'light',
                                        label: 'Light',
                                    },
                                    {
                                        value: 'outline',
                                        label: 'Outline',
                                    },
                                    {
                                        value: 'transparent',
                                        label: 'Transparent',
                                    },
                                ]}
                            />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <InputSelectControlled
                                label="Button type"
                                name="buttonType"
                                validation={{
                                    required: 'Button type is required',
                                }}
                                data={[
                                    {
                                        value: 'submit',
                                        label: 'Submit',
                                    },
                                    {
                                        value: 'button',
                                        label: 'Button',
                                    },
                                ]}
                            />
                        </Grid.Col>
                    </Grid>

                    {submitButton}
                </>
            )}
        />
    );
}
