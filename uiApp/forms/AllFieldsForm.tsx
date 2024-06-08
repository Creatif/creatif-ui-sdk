import css from './realEstate/css/root.module.css';
import {
    InputText,
    InputCheckbox,
    Form,
    InputCheckboxControlled,
    InputCheckboxGroupControlled,
    InputChipControlled,
    InputDateControlled,
    InputEmail,
    InputNumberControlled,
    InputPinControlled,
    InputRadio,
    InputRadioControlled,
    InputRadioGroupControlled,
    InputRangeSliderControlled,
    InputRatingControlled,
    InputSegmentedControlControlled,
    InputSelectControlled,
    InputSliderControlled,
    InputSwitch,
    InputSwitchGroupControlled,
    InputSwitchControlled,
    InputTextareaControlled,
    InputTextControlled,
} from '../../src';

export function AllFieldsForm() {
    return (
        <Form
            bindings={{
                name: (values) => `${values.name}-${values.lastName}-${values.address}`,
            }}
            inputs={(submitButton) => (
                <>
                    <div className={css.fieldGrid}>
                        <div>
                            <InputText
                                label="Name"
                                name="name"
                                options={{
                                    required: 'Name is required',
                                }}
                            />
                        </div>

                        <div>
                            <InputCheckbox
                                label="checkbox"
                                name="checkbox"
                                options={{
                                    required: 'checkbox is required',
                                }}
                            />

                        </div>

                        <div>
                            <InputCheckboxControlled name="checkboxControlled" label="checkboxControlled" options={{
                                required: 'Checkbox controlled is required'
                            }} />
                        </div>

                        <div>
                            <InputCheckboxGroupControlled name="checkboxGroupControlled" label="checkboxGroupControlled" options={{
                                required: 'Checkbox group controlled is required'
                            }}>
                                <InputCheckboxControlled name="name" value="one" label="one" />
                                <InputCheckboxControlled name="name" value="two" label="two" />
                                <InputCheckboxControlled name="name" value="three" label="three" />
                                <InputCheckboxControlled name="name" value="four" label="four" />
                            </InputCheckboxGroupControlled>
                        </div>

                        <div>
                            <InputChipControlled name="chipControlled">
                                Chip controlled
                            </InputChipControlled>
                        </div>

                        <div>
                            <InputDateControlled name="dateControlled" placeholder="placeholder" />
                        </div>

                        <div>
                            <InputEmail name="email" placeholder="Email" />
                        </div>

                        <div>
                            <InputNumberControlled name="numberControlled" placeholder="Number controlled" />
                        </div>

                        <div>
                            <InputPinControlled name="pinControlled" placeholder="Pin controlled" />
                        </div>

                        <div>
                            <InputRadio name="radio" placeholder="Radio" label="Radio" />
                        </div>

                        <div>
                            <InputRadioControlled name="radioControlled" placeholder="radio controlled" label="Radio controlled" onInputChange={console.log} />
                        </div>

                        <div>
                            <InputRadioGroupControlled name="radioGroupControlled" label="Radio group controlled">
                                <InputRadio name="one" label="one" />
                                <InputRadio name="two" />
                                <InputRadio name="three" />
                                <InputRadio name="four" />
                            </InputRadioGroupControlled>
                        </div>

                        <div>
                            <InputRangeSliderControlled name="sliderControlled" label="slider" />
                        </div>

                        <div>
                            <InputRatingControlled name="ratingControlled" label="rating controlled" />
                        </div>

                        <div>
                            <InputSegmentedControlControlled name="segmentedControl" data={['one', 'two']} />
                        </div>
                    </div>

                    <div>
                        <InputSelectControlled name="selectControlled" data={['one', 'two', 'three', 'four']} />
                    </div>

                    <div>
                        <InputSliderControlled name="sliderControlled" label="Slider controlled" />
                    </div>

                    <div>
                        <InputSwitch name="switch" label="Switch" />
                    </div>

                    <div>
                        <InputSwitchControlled name="switchControlled" label="Switch controlled" />
                    </div>

                    <div className={css.submitButton}>{submitButton}</div>
                </>
            )}
        />
    );
}
