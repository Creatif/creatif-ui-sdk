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
import List from '@app/uiComponents/listing/List';
import {
	Center,
	Checkbox,
	Container,
	Fieldset,
	Grid,
	Group,
	Radio, Switch,
} from '@mantine/core';
import contentStyles from './css/content.module.css';

export default function Content() {
	return (
		<div className={contentStyles.root}>
			<Center>

				<List listName="landing page" />





				{/*				<ListForm<{
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

						console.log(values);

						return values;
					}}
					afterSave={(values) => {
						console.log(values);
					}}
					bindings={{
						name: (values) => values.email,
						groups: (values) => [values.name, values.lastName, values.email, values.name, values.lastName, values.email],
					}}
					listName="landing page"
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
						<Grid>
							<Grid.Col span={12}>
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
							</Grid.Col>

							<Grid.Col span={6}>
								<InputText
									options={{
										required: 'Last name is required',
									}}
									label="Last name"
									name="lastName"
								/>
							</Grid.Col>

							<Grid.Col span={6}>
								<InputEmail label="Email" name="email" />
							</Grid.Col>

							<Grid.Col span={6}>
								<InputDateControlled
									validation={{
										required: 'Date of birth is required.',
									}}
									label="Date of birth"
									name="dob"
								/>
							</Grid.Col>

							<Grid.Col span={6}>
								<InputRatingControlled name="rating" />
							</Grid.Col>

							<Grid.Col span={6}>
								<InputChipControlled
									validation={{
										required: 'Eligible field is required.',
									}}
									name="eligible"
								>
                      Are you eligible?
								</InputChipControlled>
							</Grid.Col>

							<Grid.Col span={6}>
								<InputSegmentedControlControlled
									data={[
										{ label: 'React', value: 'react' },
										{ label: 'Angular', value: 'ng' },
										{ label: 'Vue', value: 'vue' },
										{ label: 'Svelte', value: 'svelte' },
									]}
									name="segmentedControl"
								/>
							</Grid.Col>

							<Grid.Col span={6}>
								<InputCheckboxControlled
									validation={{
										required: 'Controlled checkbox field is required.',
									}}
									label="Controlled checkbox"
									name="checkboxControlled"
								/>
							</Grid.Col>

							<Grid.Col span={6}>
								<InputRadioGroupControlled
									label="Radio group"
									name="radioGroup"
								>
									<Radio value="react" label="React" />
									<Radio value="svelte" label="Svelte" />
									<Radio value="ng" label="Angular" />
									<Radio value="vue" label="Vue" />
								</InputRadioGroupControlled>
							</Grid.Col>

							<Grid.Col span={6}>
								<InputCheckbox label="Checkbox" name="checkbox" />
							</Grid.Col>

							<Grid.Col span={6}>
								<InputRadio
									label="Radio"
									name="radio"
								/>
							</Grid.Col>

							<Grid.Col span={6}>
								<InputRadioControlled
									label="Controlled radio"
									name="controlledRadio"
								/>
							</Grid.Col>

							<Grid.Col span={6}>
								<InputPinControlled
									name="pin"
									validation={{ required: true }}
								/>
							</Grid.Col>

							<Grid.Col span={6}>
								<InputSwitch
									name="switch"
									label="Switch"
								/>
							</Grid.Col>

							<Grid.Col span={6}>
								<InputSwitchControlled
									name="switchControlled"
									label="Switch controlled"
								/>
							</Grid.Col>

							<Grid.Col span={6}>
								<InputSliderControlled
									name="slider"
									label="Slider"
									marks={[
										{ value: 20, label: '20%' },
										{ value: 50, label: '50%' },
										{ value: 80, label: '80%' },
									]}
								/>
							</Grid.Col>

							<Grid.Col span={6}>
								<InputRangeSliderControlled
									name="rangeSlider"
									label="Range slider"
									marks={[
										{ value: 20, label: '20%' },
										{ value: 50, label: '50%' },
										{ value: 80, label: '80%' },
									]}
								/>
							</Grid.Col>

							<Grid.Col span={6}>
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
							</Grid.Col>

							<Grid.Col span={6}>
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
							</Grid.Col>
							<Grid.Col span={12}>{submitButton}</Grid.Col>
						</Grid>
					)}
				/>*/}
			</Center>
		</div>
	);
}
