import { InputCheckbox, InputNumberControlled } from '../../../../src';
import { useFormContext } from 'react-hook-form';
import css from '../css/root.module.css';
import { Grid } from '../../../../src';
import { Cell } from '../../../../src';

export function ApartmentForm() {
    const { watch } = useFormContext();
    const apartmentBalcony = watch('apartmentBalcony');

    return (
        <Grid cls={[css.spacing]}>
            <Cell span="span 12" cls={[css.houseDetailsHeader]}>APARTMENT DETAILS</Cell>

            <Cell span="span 4">
                <InputNumberControlled
                    name="apartmentFloorNumber"
                    label="Floor number"
                    options={{
                        required: 'Floor number is required',
                    }}
                />
            </Cell>

            <Cell span="span 4">
                <InputNumberControlled
                    name="apartmentSize"
                    label="Size (in meters squared)"
                    options={{
                        required: 'Size is required',
                    }}
                />
            </Cell>

            <Cell span="span 4">
                <InputNumberControlled
                    name="apartmentLocalPrice"
                    label="Local price (in meters squared)"
                    options={{
                        required: 'Local price is required',
                    }}
                />
            </Cell>

            <Cell span="span 12">
                <InputCheckbox name="apartmentBalcony" label="Has balcony?" />
            </Cell>

            {apartmentBalcony && <Cell span="span 12">
                <InputNumberControlled
                    name="apartmentBalconySize"
                    label="Balcony size"
                    options={{
                        required: 'Balcony size is required',
                    }}
                />
            </Cell>}
        </Grid>
    );
}
