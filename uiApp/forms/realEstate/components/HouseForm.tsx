import { InputCheckbox, InputNumberControlled, InputTextarea } from '../../../../src';
import { useFormContext } from 'react-hook-form';
import css from '../css/root.module.css';

export function HouseForm() {
    const { watch } = useFormContext();

    const backYard = watch('houseBackYard');
    const needsRepair = watch('houseNeedsRepair');

    return (
        <div>
            <h1 className={css.houseDetailsHeader}>HOUSE DETAILS</h1>

            <div className={css.fieldGrid}>
                <div>
                    <InputNumberControlled
                        name="numOfHouseFloors"
                        label="Number of floors"
                        validation={{
                            required: 'Number of floors is required',
                        }}
                    />
                </div>

                <div>
                    <InputNumberControlled
                        name="houseSize"
                        label="Size"
                        description="In meters squared"
                        validation={{
                            required: 'Size is required',
                        }}
                    />
                </div>

                <div>
                    <InputNumberControlled
                        name="houseLocalPrice"
                        label="Local price"
                        description="Per meters squared"
                        validation={{
                            required: 'Local price is required',
                        }}
                    />
                </div>

                <div>
                    <InputCheckbox name="houseBackYard" label="Has back yard?" />
                </div>

                <div>
                    <InputCheckbox name="houseNeedsRepair" label="Need repair?" />
                </div>
            </div>

            <div className={css.fieldGrid}>
                {backYard && (
                    <div>
                        <InputNumberControlled
                            name="houseBackYardSize"
                            label="Back yard size"
                            description="Size in meters squared"
                            validation={{
                                required: 'Back yard size is required',
                            }}
                        />
                    </div>
                )}

                {needsRepair && (
                    <div
                        style={{
                            gridColumn: 'span 2',
                        }}>
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
                    </div>
                )}
            </div>
        </div>
    );
}
