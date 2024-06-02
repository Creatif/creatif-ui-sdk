import { Form } from '../../../src/app/uiComponents/form/Form';
import { InputText, InputSelectControlled, InputTextarea } from '../../../src';
import { HouseInfo } from './components/HouseInfo';
import { ApartmentInfo } from './components/ApartmentInfo';
import css from './css/root.module.css';
export function PropertyForm() {
    return (
        <Form<{
            address: string;
            city: string;
            postalCode: string;
            propertyType: string;
            houseBackYard: boolean;
            apartmentBalcony: boolean;
        }>
            bindings={{
                name: (values) => `${values.address}-${values.city}-${values.postalCode}`,
            }}
            formProps={{
                defaultValues: {
                    address: '',
                    city: '',
                    postalCode: '',
                },
            }}
            inputs={(submitButton, { watch, inputReference }) => {
                const propertyType = watch('propertyType');

                return (
                    <>
                        {inputReference({
                            structureName: 'Accounts',
                            name: 'accounts',
                            structureType: 'map',
                            label: 'Account',
                            validation: {
                                required: 'Selecting an owner is required',
                            },
                        })}

                        <div>
                            <div className={css.fieldGrid}>
                                <div>
                                    <InputText
                                        label="Address"
                                        name="address"
                                        options={{
                                            required: 'Address is required',
                                        }}
                                    />
                                </div>

                                <div>
                                    <InputText
                                        label="City"
                                        name="city"
                                        options={{
                                            required: 'City is required',
                                        }}
                                    />
                                </div>

                                <div>
                                    <InputText
                                        label="Postal code"
                                        name="postalCode"
                                        options={{
                                            required: 'Postal code is required',
                                        }}
                                    />
                                </div>

                                <div>
                                    <InputSelectControlled
                                        data={['Rent', 'Sell', 'Rent business']}
                                        label="Property status"
                                        name="propertyStatus"
                                        validation={{
                                            required: 'Property status is required',
                                        }}
                                    />
                                </div>

                                <div>
                                    <InputSelectControlled
                                        data={['House', 'Apartment', 'Studio', 'Land']}
                                        label="Property type"
                                        name="propertyType"
                                        validation={{
                                            required: 'Property type is required',
                                        }}
                                    />
                                </div>
                            </div>

                            {propertyType === 'Apartment' && <ApartmentInfo />}

                            {propertyType === 'House' && <HouseInfo />}
                        </div>

                        <div className={css.accountNote}>
                            <InputTextarea
                                label="Account note"
                                name="finalNote"
                                description="Describe anything that could not be represented in the fields above"
                            />
                        </div>

                        <div className={css.submitButton}>{submitButton}</div>
                    </>
                );
            }}
        />
    );
}
