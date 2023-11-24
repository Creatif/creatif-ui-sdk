import InputChipControlled from '@app/uiComponents/inputs/InputChipControlled';
import InputDate from '@app/uiComponents/inputs/InputDate';
import InputEmail from '@app/uiComponents/inputs/InputEmail';
import InputText from '@app/uiComponents/inputs/InputText';
import ListForm from '@app/uiComponents/listForm/ListForm';
import { Center, Container, Fieldset, Grid } from '@mantine/core';
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
          			}>
						beforeSave={(values) => {
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
										<InputDate
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
