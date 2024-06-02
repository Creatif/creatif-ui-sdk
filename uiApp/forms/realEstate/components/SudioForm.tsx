import { InputNumberControlled } from '../../../../src';
import css from '../css/root.module.css';

export function StudioForm() {
    return (
        <div>
            <h1 className={css.houseDetailsHeader}>STUDIO DETAILS</h1>

            <div className={css.fieldGrid}>
                <div>
                    <InputNumberControlled
                        name="studioFloorNumber"
                        label="Floor number"
                        validation={{
                            required: 'Floor number is required',
                        }}
                    />
                </div>

                <div>
                    <InputNumberControlled
                        name="studioSize"
                        label="Size (in meters squared)"
                        validation={{
                            required: 'Size is required',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
