import { InputCheckbox, InputNumberControlled } from '../../../../src';
import css from '../css/root.module.css';
import { Grid } from '../../../../src';
import { Cell } from '../../../../src';

export function LandForm() {
    return (
        <Grid cls={[css.spacing]}>
            <Cell cls={[css.houseDetailsHeader]}>APARTMENT DETAILS</Cell>

            <Cell span="span 12">
                <InputNumberControlled
                    name="landSize"
                    label="Size (in meters squared)"
                    validation={{
                        required: 'Size is required',
                    }}
                />
            </Cell>

            <Cell span="span 12">
                <InputCheckbox name="hasConstructionPermit" label="Has construction Permit?" />
            </Cell>
        </Grid>
    );
}
