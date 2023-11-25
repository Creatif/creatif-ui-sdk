import InputCheckbox from '@app/uiComponents/inputs/InputCheckbox';
import InputCheckboxControlled from '@app/uiComponents/inputs/InputCheckboxControlled';
import InputCheckboxGroupControlled from '@app/uiComponents/inputs/InputCheckboxGroupControlled';
import InputChipControlled from '@app/uiComponents/inputs/InputChipControlled';
import InputDateControlled from '@app/uiComponents/inputs/InputDateControlled';
import InputEmail from '@app/uiComponents/inputs/InputEmail';
import InputText from '@app/uiComponents/inputs/InputText';
import ListForm from '@app/uiComponents/listForm/ListForm';
import {
	Center,
	Checkbox,
	Container,
	Fieldset,
	Grid,
	Group, Tooltip,
} from '@mantine/core';
import contentStyles from './css/content.module.css';

export default function Content() {
	return (
		<div className={contentStyles.root}>
			<Center>
				<Container size="lg" fluid>
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
            checkboxGroup: [];
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
							groups: (values) => [values.name, values.lastName, values.email],
						}}
						listName="landing page"
						formProps={{
							defaultValues: {
								name: '',
								lastName: '',
								email: '',
								dob: '',
								eligible: false,
								uncontrolledEligible: false,
							},
						}}
						inputs={(submitButton) => (
							<Fieldset legend="Personal information">
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
										<InputCheckboxControlled
											validation={{
												required: 'Controlled checkbox field is required.',
											}}
											label="Controlled checkbox"
											name="checkboxControlled"
										/>
									</Grid.Col>

									<Grid.Col span={6}>
										<InputCheckbox label="Checkbox" name="checkbox" />
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
									<Grid.Col span={12}>{submitButton}</Grid.Col>
								</Grid>
							</Fieldset>
						)}
					/>
				</Container>
			</Center>
		</div>
	);
}
