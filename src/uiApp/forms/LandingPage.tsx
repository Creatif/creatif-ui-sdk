import FormGrid from '@app/components/grid/FormGrid';
import GridCell from '@app/components/grid/GridCell';
import InputCheckbox from '@app/uiComponents/inputs/InputCheckbox';
import InputCheckboxControlled from '@app/uiComponents/inputs/InputCheckboxControlled';
import InputCheckboxGroupControlled from '@app/uiComponents/inputs/InputCheckboxGroupControlled';
import InputChipControlled from '@app/uiComponents/inputs/InputChipControlled';
import InputDateControlled from '@app/uiComponents/inputs/InputDateControlled';
import InputEmail from '@app/uiComponents/inputs/InputEmail';
import InputPinControlled from '@app/uiComponents/inputs/InputPinControlled';
import InputRadio from '@app/uiComponents/inputs/InputRadio';
import InputRadioControlled from '@app/uiComponents/inputs/InputRadioControlled';
import InputRadioGroupControlled from '@app/uiComponents/inputs/InputRadioGroupControlled';
import InputRangeSliderControlled from '@app/uiComponents/inputs/InputRangeSliderControlled';
import InputRatingControlled from '@app/uiComponents/inputs/InputRatingControlled';
import InputSegmentedControlControlled from '@app/uiComponents/inputs/InputSegmentedControlControlled';
import InputSliderControlled from '@app/uiComponents/inputs/InputSliderControlled';
import InputSwitch from '@app/uiComponents/inputs/InputSwitch';
import InputSwitchControlled from '@app/uiComponents/inputs/InputSwitchControlled';
import InputSwitchGroupControlled from '@app/uiComponents/inputs/InputSwitchGroupControlled';
import InputText from '@app/uiComponents/inputs/InputText';
import ListForm from '@app/uiComponents/listForm/ListForm';
import { Checkbox, Group, Radio, Switch } from '@mantine/core';
interface Props {
    structureName: string;
    mode?: 'update';
}
export default function LandingPage({ structureName, mode }: Props) {
    return (
        <ListForm<{
            name: string;
            lastName: string;
            email: string;
            dob: string;
            eligible: boolean;
            uncontrolledEligible: boolean;
            checkboxControlled: boolean;
            checkbox: boolean;
            chipUncontrolled: boolean;
            checkboxGroup: string[];
            radio: string;
            controlledRadio: string;
            radioGroup: string;
            pin: string;
            rating: string;
            segmentedControl: string;
            switch: boolean;
            switchControlled: boolean;
            switchGroup: string[];
            slider: number;
            rangeSlider: [number, number];
        }>
            beforeSave={(values) => {
                if (!values.checkboxGroup) {
                    values.checkboxGroup = [];
                }

                return {
                    value: values,
                    metadata: undefined,
                };
            }}
            mode={mode}
            bindings={{
                name: (values) => values.email,
                groups: (values) => [
                    values.name,
                    values.lastName,
                    values.email,
                    values.name,
                    values.lastName,
                    values.email,
                ],
            }}
            listName={structureName}
            formProps={{
                defaultValues: {
                    name: '',
                    lastName: '',
                    email: '',
                    dob: '',
                    eligible: false,
                    radio: '',
                    uncontrolledEligible: true,
                    controlledRadio: '',
                    checkboxControlled: false,
                    checkbox: false,
                    radioGroup: '',
                    pin: '',
                    checkboxGroup: [],
                    rating: '',
                    segmentedControl: '',
                    switch: false,
                    switchControlled: false,
                    switchGroup: [],
                    slider: 0,
                    rangeSlider: [],
                },
            }}
            inputs={(submitButton) => (
                <>
                    <FormGrid>
                        <GridCell>
                            <InputText
                                options={{
                                    required: 'Name is required',
                                    validate: (value: string) => {
                                        if (value !== 'mario') return 'It should say mario';
                                    },
                                }}
                                label="Name"
                                name="name"
                            />
                        </GridCell>

                        <GridCell>
                            <InputText
                                options={{
                                    required: 'Last name is required',
                                }}
                                label="Last name"
                                name="lastName"
                            />
                        </GridCell>

                        <GridCell>
                            <InputEmail label="Email" name="email" />
                        </GridCell>

                        <GridCell>
                            <InputDateControlled
                                validation={{
                                    required: 'Date of birth is required.',
                                }}
                                label="Date of birth"
                                name="dob"
                            />
                        </GridCell>

                        <GridCell>
                            <InputRatingControlled name="rating" />
                        </GridCell>

                        <GridCell>
                            <InputChipControlled
                                validation={{
                                    required: 'Eligible field is required.',
                                }}
                                name="eligible">
                                Are you eligible?
                            </InputChipControlled>
                        </GridCell>

                        <GridCell>
                            <InputSegmentedControlControlled
                                data={[
                                    { label: 'React', value: 'react' },
                                    { label: 'Angular', value: 'ng' },
                                    { label: 'Vue', value: 'vue' },
                                    { label: 'Svelte', value: 'svelte' },
                                ]}
                                name="segmentedControl"
                            />
                        </GridCell>

                        <GridCell>
                            <InputCheckboxControlled
                                validation={{
                                    required: 'Controlled checkbox field is required.',
                                }}
                                label="Controlled checkbox"
                                name="checkboxControlled"
                            />
                        </GridCell>

                        <GridCell>
                            <InputRadioGroupControlled label="Radio group" name="radioGroup">
                                <Radio value="react" label="React" />
                                <Radio value="svelte" label="Svelte" />
                                <Radio value="ng" label="Angular" />
                                <Radio value="vue" label="Vue" />
                            </InputRadioGroupControlled>
                        </GridCell>

                        <GridCell>
                            <InputCheckbox label="Checkbox" name="checkbox" />
                        </GridCell>

                        <GridCell>
                            <InputRadio label="Radio" name="radio" />
                        </GridCell>

                        <GridCell>
                            <InputRadioControlled label="Controlled radio" name="controlledRadio" />
                        </GridCell>

                        <GridCell>
                            <InputPinControlled name="pin" validation={{ required: true }} />
                        </GridCell>

                        <GridCell>
                            <InputSwitch name="switch" label="Switch" />
                        </GridCell>

                        <GridCell>
                            <InputSwitchControlled name="switchControlled" label="Switch controlled" />
                        </GridCell>

                        <GridCell>
                            <InputSliderControlled
                                name="slider"
                                label="Slider"
                                marks={[
                                    { value: 20, label: '20%' },
                                    { value: 50, label: '50%' },
                                    { value: 80, label: '80%' },
                                ]}
                            />
                        </GridCell>

                        <GridCell>
                            <InputRangeSliderControlled
                                name="rangeSlider"
                                label="Range slider"
                                marks={[
                                    { value: 20, label: '20%' },
                                    { value: 50, label: '50%' },
                                    { value: 80, label: '80%' },
                                ]}
                            />
                        </GridCell>

                        <GridCell>
                            <InputCheckboxGroupControlled
                                validation={{
                                    required: 'Checkbox group is required',
                                }}
                                label="Checkbox group"
                                name="checkboxGroup"
                                component={({ formState: { errors } }) => (
                                    <Group mt="xs">
                                        <Checkbox
                                            error={Boolean(errors['checkboxGroup'])}
                                            value="react"
                                            label="React"
                                        />
                                        <Checkbox
                                            error={Boolean(errors['checkboxGroup'])}
                                            value="svelte"
                                            label="Svelte"
                                        />
                                        <Checkbox error={Boolean(errors['checkboxGroup'])} value="ng" label="Angular" />
                                        <Checkbox error={Boolean(errors['checkboxGroup'])} value="vue" label="Vue" />
                                    </Group>
                                )}
                            />
                        </GridCell>

                        <GridCell>
                            <InputSwitchGroupControlled
                                validation={{
                                    required: 'Switch group is required',
                                }}
                                label="Switch group"
                                name="switchGroup"
                                component={({ formState: { errors } }) => (
                                    <Group mt="xs">
                                        <Switch error={Boolean(errors['switchGroup'])} value="react" label="React" />
                                        <Switch error={Boolean(errors['switchGroup'])} value="svelte" label="Svelte" />
                                        <Switch error={Boolean(errors['switchGroup'])} value="ng" label="Angular" />
                                        <Switch error={Boolean(errors['switchGroup'])} value="vue" label="Vue" />
                                    </Group>
                                )}
                            />
                        </GridCell>
                    </FormGrid>

                    {submitButton}
                </>
            )}
        />
    );
}
