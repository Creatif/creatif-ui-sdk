import FormGrid from '@app/components/grid/FormGrid';
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
import { Checkbox, Grid, Group, Radio, Switch } from '@mantine/core';
interface Props {
  structureName: string;
}
export default function LandingPage({ structureName }: Props) {
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

				return values;
			}}
			afterSave={(values) => {
				console.log(values);
			}}
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
					name: 'mario',
					lastName: 'skrlec',
					email: 'marioskrlec222@gmail.com',
					dob: 'November 25, 2023',
					eligible: true,
					radio: 'on',
					uncontrolledEligible: true,
					controlledRadio: 'on',
					checkboxControlled: true,
					checkbox: true,
					radioGroup: 'ng',
					pin: '1234',
					checkboxGroup: ['react', 'svelte'],
					rating: '3',
					segmentedControl: 'svelte',
					switch: true,
					switchControlled: true,
					switchGroup: ['react', 'ng'],
					slider: 5,
					rangeSlider: [12, 25],
				},
			}}
			inputs={(submitButton) => (
				<FormGrid>
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

					<InputText
						options={{
							required: 'Last name is required',
						}}
						label="Last name"
						name="lastName"
					/>

					<InputEmail label="Email" name="email" />

					<InputDateControlled
						validation={{
							required: 'Date of birth is required.',
						}}
						label="Date of birth"
						name="dob"
					/>

					<InputRatingControlled name="rating" />

					<InputChipControlled
						validation={{
							required: 'Eligible field is required.',
						}}
						name="eligible"
					>
						Are you eligible?
					</InputChipControlled>

					<InputSegmentedControlControlled
						data={[
							{ label: 'React', value: 'react' },
							{ label: 'Angular', value: 'ng' },
							{ label: 'Vue', value: 'vue' },
							{ label: 'Svelte', value: 'svelte' },
						]}
						name="segmentedControl"
					/>

					<InputCheckboxControlled
						validation={{
							required: 'Controlled checkbox field is required.',
						}}
						label="Controlled checkbox"
						name="checkboxControlled"
					/>

					<InputRadioGroupControlled label="Radio group" name="radioGroup">
						<Radio value="react" label="React" />
						<Radio value="svelte" label="Svelte" />
						<Radio value="ng" label="Angular" />
						<Radio value="vue" label="Vue" />
					</InputRadioGroupControlled>

					<InputCheckbox label="Checkbox" name="checkbox" />
					<InputRadio label="Radio" name="radio" />

					<InputRadioControlled
						label="Controlled radio"
						name="controlledRadio"
					/>

					<InputPinControlled name="pin" validation={{ required: true }} />
					<InputSwitch name="switch" label="Switch" />
					<InputSwitchControlled
						name="switchControlled"
						label="Switch controlled"
					/>

					<InputSliderControlled
						name="slider"
						label="Slider"
						marks={[
							{ value: 20, label: '20%' },
							{ value: 50, label: '50%' },
							{ value: 80, label: '80%' },
						]}
					/>

					<InputRangeSliderControlled
						name="rangeSlider"
						label="Range slider"
						marks={[
							{ value: 20, label: '20%' },
							{ value: 50, label: '50%' },
							{ value: 80, label: '80%' },
						]}
					/>

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
								<Checkbox
									error={Boolean(errors['checkboxGroup'])}
									value="ng"
									label="Angular"
								/>
								<Checkbox
									error={Boolean(errors['checkboxGroup'])}
									value="vue"
									label="Vue"
								/>
							</Group>
						)}
					/>

					<InputSwitchGroupControlled
						validation={{
							required: 'Switch group is required',
						}}
						label="Switch group"
						name="switchGroup"
						component={({ formState: { errors } }) => (
							<Group mt="xs">
								<Switch
									error={Boolean(errors['switchGroup'])}
									value="react"
									label="React"
								/>
								<Switch
									error={Boolean(errors['switchGroup'])}
									value="svelte"
									label="Svelte"
								/>
								<Switch
									error={Boolean(errors['switchGroup'])}
									value="ng"
									label="Angular"
								/>
								<Switch
									error={Boolean(errors['switchGroup'])}
									value="vue"
									label="Vue"
								/>
							</Group>
						)}
					/>

					{submitButton}
				</FormGrid>
			)}
		/>
	);
}
