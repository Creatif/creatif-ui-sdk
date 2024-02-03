import InputText from '@app/uiComponents/inputs/InputText';
import { Grid } from '@mantine/core';
import InputCheckbox from '@app/uiComponents/inputs/InputCheckbox';
import ListForm from '@app/uiComponents/listForm/ListForm';
interface Props {
    mode?: 'update';
}
export default function ListOrganizationForm({ mode }: Props) {
    return (
        <ListForm<{
            name: string;
            isEuropean: boolean;
        }>
            mode={mode}
            bindings={{
                name: (values) => values.name,
            }}
            formProps={{
                defaultValues: {
                    name: '',
                    isEuropean: false,
                },
            }}
            inputs={(submitButton, { inputBehaviour, inputReference }) => (
                <>
                    <Grid>
                        <Grid.Col span={6}>
                            <InputText
                                label="Name"
                                name="name"
                                options={{
                                    required: 'Organization name is required',
                                }}
                            />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <InputCheckbox
                                label="Is european"
                                name="isEuropean"
                                options={{
                                    required: 'This check is required',
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
