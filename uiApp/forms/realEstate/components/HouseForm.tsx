import { InputCheckbox, InputNumberControlled, InputTextarea } from '../../../../src';
import { useFormContext } from 'react-hook-form';
import css from '../css/root.module.css';
import { Grid } from '../../../../src';
import { Cell } from '../../../../build';

export function HouseForm() {
    const { watch } = useFormContext();

    const backYard = watch('houseBackYard');
    const needsRepair = watch('houseNeedsRepair');

    return (
        <Grid cls={[css.spacing]}>
            <Cell span="span 12" cls={[css.houseDetailsHeader]}>HOUSE DETAILS</Cell>

            <Cell span="span 4">
                <div>
                    <InputNumberControlled
                        name="numOfHouseFloors"
                        label="Number of floors"
                        validation={{
                            required: 'Number of floors is required',
                        }}
                    />
                </div>
            </Cell>

            <Cell span="span 4">
                <InputNumberControlled
                    name="houseSize"
                    label="Size"
                    description="In meters squared"
                    validation={{
                        required: 'Size is required',
                    }}
                />
            </Cell>

            <Cell span="span 4">
                <InputNumberControlled
                    name="houseLocalPrice"
                    label="Local price"
                    description="Per meters squared"
                    validation={{
                        required: 'Local price is required',
                    }}
                />
            </Cell>

            <Cell span="span 12">
                <InputCheckbox name="houseBackYard" label="Has back yard?" />
            </Cell>

            {backYard && <Cell span="span 12">
                <InputNumberControlled
                    name="houseBackYardSize"
                    label="Back yard size"
                    description="Size in meters squared"
                    validation={{
                        required: 'Back yard size is required',
                    }}
                />
            </Cell>}

            <Cell span="span 12">
                <InputCheckbox name="houseNeedsRepair" label="Need repair?" />
            </Cell>

            {needsRepair && <Cell span="span 12">
                <InputTextarea
                    description="The description should be as detailed as possible"
                    resize="both"
                    autosize={true}
                    minRows={2}
                    maxRows={10}
                    name="houseRepairNote"
                    label="Describe the repairs"
                    options={{
                        required: 'Note is required',
                    }}
                    />
            </Cell>}
        </Grid>
    );
}
