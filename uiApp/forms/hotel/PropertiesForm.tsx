import Form from '../../../src/app/uiComponents/form/Form';
import { Fieldset, Grid, Group } from '@mantine/core';
import { InputText, InputCheckbox, InputNumberControlled, InputRatingControlled } from '../../../src';

export function PropertiesForm() {
    return (
        <Form<{
            name: string;
            bedroomsNum: number;
            luxuryRooms: boolean;
            hasRestaurant: boolean;
            restaurantHeadChefName: string;
            restaurantHeadChefLastname: string;
            restaurantNumOfStars: number;
        }>
            bindings={{
                name: (values) => `${values.name}`,
            }}
            formProps={{
                defaultValues: {
                    name: '',
                    bedroomsNum: 0,
                    luxuryRooms: false,
                    hasRestaurant: false,
                    restaurantHeadChefName: '',
                    restaurantHeadChefLastname: '',
                    restaurantNumOfStars: 0,
                },
            }}
            inputs={(submitButton, { inputConnection, watch }) => {
                const hasRestaurant = watch('hasRestaurant');

                return (
                    <>
                        <Grid>
                            <Grid.Col span={6}>
                                <InputText
                                    label="Name"
                                    name="name"
                                    options={{
                                        required: 'Name is required',
                                    }}
                                />
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <InputNumberControlled
                                    label="Number of bedrooms"
                                    name="bedroomsNum"
                                    options={{
                                        required: 'Number of bedrooms is required',
                                    }}
                                />
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <InputCheckbox label="Has luxury rooms?" name="luxuryRooms" />
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <InputCheckbox label="Has restaurant?" name="hasRestaurant" />
                            </Grid.Col>

                            {hasRestaurant && (
                                <Grid.Col span={12}>
                                    <Fieldset
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '1rem',
                                        }}>
                                        <InputText label="Head Chef name" name="restaurantHeadChefName" />
                                        <InputText label="Head Chef last name" name="restaurantHeadChefLastname" />

                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.5rem',
                                            }}>
                                            <label htmlFor="restaurantNumOfStars">Number of restaurant stars</label>

                                            <InputRatingControlled
                                                label="Restaurant stars"
                                                name="restaurantNumOfStars"
                                            />
                                        </div>
                                    </Fieldset>
                                </Grid.Col>
                            )}

                            <Grid.Col span={6}>
                                {inputConnection({
                                    name: 'manager',
                                    structureName: 'Managers',
                                    structureType: 'map',
                                })}
                            </Grid.Col>

                            <Grid.Col span={6}>
                                {inputConnection({
                                    name: 'region',
                                    structureName: 'Regions',
                                    structureType: 'map',
                                })}
                            </Grid.Col>

                            <Grid.Col span={6}>
                                {inputConnection({
                                    name: 'category',
                                    structureName: 'Categories',
                                    structureType: 'map',
                                })}
                            </Grid.Col>
                        </Grid>

                        <Group
                            align="center"
                            justify="flex-end"
                            style={{
                                marginTop: '1rem',
                            }}>
                            {submitButton}
                        </Group>
                    </>
                );
            }}
        />
    );
}
