import InputText from '@app/uiComponents/inputs/InputText';
import ListForm from '@app/uiComponents/listForm/ListForm';
import { Fieldset, Grid } from '@mantine/core';
import InputNumberControlled from '@app/uiComponents/inputs/InputNumberControlled';
import InputTextarea from '@app/uiComponents/inputs/InputTextarea';
interface Props {
    structureName: string;
    mode?: 'update';
}
export default function LandingPage({ structureName, mode }: Props) {
    return (
        <ListForm<{
            parkName: string;
            lat: number | '';
            long: number | '';
            area: string;
            description: string;
        }>
            mode={mode}
            bindings={{
                name: (values) => values.parkName,
            }}
            listName={structureName}
            formProps={{
                defaultValues: {
                    parkName: '',
                    lat: '',
                    long: '',
                    area: '',
                    description: '',
                },
            }}
            inputs={(submitButton, { inputLocale, inputGroups, inputBehaviour }) => (
                <>
                    <Grid>
                        <Grid.Col span={12}>
                            <InputText
                                label="Park name"
                                name="parkName"
                                options={{
                                    required: 'Park name is required',
                                }}
                            />
                        </Grid.Col>

                        <Grid.Col span={6}>{inputLocale()}</Grid.Col>

                        <Grid.Col span={6}>{inputGroups()}</Grid.Col>

                        <Grid.Col span={6}>{inputBehaviour()}</Grid.Col>

                        <Grid.Col span={12}>
                            <Fieldset legend="Coordinates">
                                <Grid columns={12}>
                                    <Grid.Col span={6}>
                                        <InputNumberControlled
                                            label="Latitude"
                                            name="lat"
                                            validation={{
                                                required: 'Latitude is required',
                                            }}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={6}>
                                        <InputNumberControlled
                                            label="Longitude"
                                            name="long"
                                            validation={{
                                                required: 'Longitude is required',
                                            }}
                                        />
                                    </Grid.Col>
                                </Grid>
                            </Fieldset>
                        </Grid.Col>

                        <Grid.Col span={12}>
                            <InputText name="area" label="Area" />
                        </Grid.Col>

                        <Grid.Col span={12}>
                            <InputTextarea name="description" label="Description" />
                        </Grid.Col>
                    </Grid>

                    {submitButton}
                </>
            )}
        />
    );
}
