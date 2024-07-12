import { Form } from '../../../src/app/uiComponents/form/Form';
import { InputText, InputSelectControlled, InputTextarea } from '../../../src';
import { HouseForm } from './components/HouseForm';
import { ApartmentForm } from './components/ApartmentForm';
import css from './css/root.module.css';
import { StudioForm } from './components/SudioForm';
import { LandForm } from './components/LandForm';
import { File } from '../../../src/app/uiComponents/inputs/fileUpload/File';
import { Grid } from '../../../src';
import { Cell } from '../../../build';

export function PropertyForm() {
    return (
        <Form<{
            address: string;
            city: string;
            postalCode: string;
            propertyStatus: 'Rent' | 'Sell' | 'Rent business' | '';
            propertyType: 'House' | 'Apartment' | 'Studio' | 'Land' | '';

            numOfHouseFloors: number | null;
            houseSize: number | null;
            houseLocalPrice: number | null;
            houseBackYard: boolean;
            houseNeedsRepair: boolean;
            houseBackYardSize: number;
            houseRepairNote: string;

            apartmentFloorNumber: number | null;
            apartmentSize: number | null;
            apartmentLocalPrice: number | null;
            apartmentBalcony: boolean;
            apartmentBalconySize: number | null;

            studioFloorNumber: number | null;
            studioSize: number | null;

            landSize: number | null;
            hasConstructionPermit: number | null;
        }>
            bindings={{
                name: (values) => `${values.address}-${values.city}-${values.postalCode}`,
            }}
            formProps={{
                defaultValues: {
                    address: '',
                    city: '',
                    postalCode: '',
                    propertyStatus: '',
                    propertyType: '',

                    numOfHouseFloors: null,
                    houseSize: null,
                    houseLocalPrice: null,
                    houseBackYard: false,
                    houseNeedsRepair: false,
                    houseBackYardSize: null,
                    houseRepairNote: '',

                    apartmentFloorNumber: null,
                    apartmentSize: null,
                    apartmentLocalPrice: null,
                    apartmentBalcony: false,
                    apartmentBalconySize: null,

                    studioFloorNumber: null,
                    studioSize: null,

                    hasConstructionPermit: null,
                    landSize: null,
                },
            }}
            inputs={(submitButton, { watch, inputConnection, inputLocale, inputGroups, inputFile }) => {
                const propertyType = watch('propertyType');

                return (
                    <Grid>
                        <Cell span="span 12">
                            {inputConnection({
                                structureName: 'Accounts',
                                name: 'accounts',
                                structureType: 'map',
                                label: 'Account',
                                options: {
                                    required: 'Selecting an owner is required',
                                },
                            })}
                        </Cell>

                        <Cell span="span 12">
                            {inputLocale()}
                        </Cell>

                        <Cell span="span 12">
                            {inputGroups()}
                        </Cell>

                        <Cell span="span 4">
                            <InputText
                                label="Address"
                                name="address"
                                options={{
                                    required: 'Address is required',
                                }}
                            />
                        </Cell>

                        <Cell span="span 4">
                            <InputText
                                label="City"
                                name="city"
                                options={{
                                    required: 'City is required',
                                }}
                            />
                        </Cell>

                        <Cell span="span 4">
                            <InputText
                                label="Postal code"
                                name="postalCode"
                                options={{
                                    required: 'Postal code is required',
                                }}
                            />
                        </Cell>

                        <Cell span="span 6">
                            <InputSelectControlled
                                data={['Rent', 'Sell', 'Rent business']}
                                label="Property status"
                                name="propertyStatus"
                                validation={{
                                    required: 'Property status is required',
                                }}
                            />
                        </Cell>

                        <Cell span="span 6">
                            <InputSelectControlled
                                data={['House', 'Apartment', 'Studio', 'Land']}
                                label="Property type"
                                name="propertyType"
                                validation={{
                                    required: 'Property type is required',
                                }}
                            />
                        </Cell>

                        <Cell span="span 12">
                            {propertyType === 'Apartment' && <ApartmentForm />}
                        </Cell>

                        <Cell span="span 12">
                            {propertyType === 'House' && <HouseForm />}
                        </Cell>

                        <Cell span="span 12">
                            {propertyType === 'Studio' && <StudioForm />}
                        </Cell>

                        <Cell span="span 12">
                            {propertyType === 'Land' && <LandForm />}
                        </Cell>

                        <Cell span="span 12">
                            <File inputFile={inputFile} name="propertyImages" label="Property images" description="You can upload as much images as you want" fileButtonProps={{
                                multiple: true,
                                accept: "image/jpg,image/jpeg,image/png,image/webp,image/avif"
                            }} />
                        </Cell>

                        <Cell span="span 12">
                            <InputTextarea
                                label="Account note"
                                name="finalNote"
                                description="Describe anything that could not be represented in the fields above"
                            />
                        </Cell>

                        <Cell span="span 12">{submitButton}</Cell>
                    </Grid>
                );
            }}
        />
    );
}
