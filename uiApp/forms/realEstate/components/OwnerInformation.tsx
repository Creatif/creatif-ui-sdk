import { Fieldset, Grid } from '@mantine/core';
import { InputText } from '../../../../src';

export function OwnerInformation() {
    return (
        <Fieldset legend="Owner information">
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
                    <InputText
                        label="Last name"
                        name="lastName"
                        options={{
                            required: 'Last name is required',
                        }}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <InputText
                        label="Address"
                        name="address"
                        options={{
                            required: 'Address is required',
                        }}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <InputText
                        label="City"
                        name="city"
                        options={{
                            required: 'City is required',
                        }}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <InputText
                        label="Postal code"
                        name="postalCode"
                        options={{
                            required: 'City is required',
                        }}
                    />
                </Grid.Col>
            </Grid>
        </Fieldset>
    );
}
