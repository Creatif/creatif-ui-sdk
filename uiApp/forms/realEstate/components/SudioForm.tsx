import { InputNumberControlled } from '../../../../src';
import css from '../css/root.module.css';
import { Grid } from '../../../../src';
import { Cell } from '../../../../src';

export function StudioForm() {
    return (
        <Grid cls={[css.spacing]}>
            <Cell span="span 12" cls={[css.houseDetailsHeader]}>STUDIO DETAILS</Cell>

            <Cell span="span 6">
                <InputNumberControlled
                    name="studioFloorNumber"
                    label="Floor number"
                    validation={{
                        required: 'Floor number is required',
                    }}
                />
            </Cell>

            <Cell span="span 6">
                <InputNumberControlled
                    name="studioSize"
                    label="Size (in meters squared)"
                    validation={{
                        required: 'Size is required',
                    }}
                />
            </Cell>
        </Grid>
    );
}
