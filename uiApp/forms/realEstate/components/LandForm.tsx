import { InputCheckbox, InputNumberControlled } from '../../../../src';
import css from '../css/root.module.css';

export function LandForm() {
    return (
        <div>
            <h1 className={css.houseDetailsHeader}>APARTMENT DETAILS</h1>

            <div className={css.fieldGrid}>
                <div>
                    <InputNumberControlled
                        name="landSize"
                        label="Size (in meters squared)"
                        validation={{
                            required: 'Size is required',
                        }}
                    />
                </div>

                <div>
                    <InputCheckbox name="hasConstructionPermit" label="Has construction Permit?" />
                </div>
            </div>
        </div>
    );
}
