import InputCheckbox from '@app/uiComponents/inputs/InputCheckbox';
import InputText from '@app/uiComponents/inputs/InputText';
import InputTextarea from '@app/uiComponents/inputs/InputTextarea';
import ListForm from '@app/uiComponents/listForm/ListForm';
import {
	Button,
	Center,
	Container, Fieldset,
	Grid,
	Group,
} from '@mantine/core';
import contentStyles from './css/content.module.css';

export default function Content() {
	return (
		<div className={contentStyles.root}>
			<Center>
				<Container size="lg" fluid>
					<ListForm
						bindings={{
							name: 'title',
						}}
						listName="landing page"
						defaultValues={{
							name: '',
							lastName: '',
							email: '',
							dob: '',
							age: '',
						}}
						inputs={(submitButton) => <Fieldset legend="Personal information">
							<Grid align="center" justify="center">
								<Grid.Col span={12}>
									<InputText
										options={{
											required: 'Name is required',
											validate: (value: string) => {
												if (value !== 'mario') return 'It should say mario';
											}
										}}
										structureName="user"
										label="Name"
										name="name"
									/>
								</Grid.Col>
								<Grid.Col span={6}>
									<InputText
										options={{
											required: 'Last name is required',
										}}
										structureName="user"
										label="Last name"
										name="lastName"
									/>
								</Grid.Col>
								<Grid.Col span={6}>
									<InputText
										options={{
											required: 'Email name is required',
										}}
										structureName="user"
										label="Email"
										name="email"
									/>
								</Grid.Col>
								<Grid.Col span={12}>
									{submitButton}
								</Grid.Col>
							</Grid>
						</Fieldset>}
					/>
				</Container>
			</Center>
		</div>
	);
}
