import { InputCheckbox, InputNumberControlled } from '../../../../src';
import { useFormContext } from 'react-hook-form';
import css from '../css/root.module.css';

export function ApartmentForm() {
    const { watch } = useFormContext();
    const apartmentBalcony = watch('apartmentBalcony');

    return (
        <div>
            <h1 className={css.houseDetailsHeader}>APARTMENT DETAILS</h1>

            <div className={css.fieldGrid}>
                <div>
                    <InputNumberControlled
                        name="apartmentFloorNumber"
                        label="Floor number"
                        validation={{
                            required: 'Floor number is required',
                        }}
                    />
                </div>

                <div>
                    <InputNumberControlled
                        name="apartmentSize"
                        label="Size (in meters squared)"
                        validation={{
                            required: 'Size is required',
                        }}
                    />
                </div>

                <div>
                    <InputNumberControlled
                        name="apartmentLocalPrice"
                        label="Local price (in meters squared)"
                        validation={{
                            required: 'Local price is required',
                        }}
                    />
                </div>

                <div>
                    <InputCheckbox name="apartmentBalcony" label="Has balcony?" />
                </div>
            </div>

            <div className={css.fieldGrid}>
                {apartmentBalcony && (
                    <div>
                        <InputNumberControlled
                            name="apartmentBalconySize"
                            label="Balcony size"
                            validation={{
                                required: 'Balcony size is required',
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
