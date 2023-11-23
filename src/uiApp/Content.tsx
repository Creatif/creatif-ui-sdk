import InputEmail from '@app/uiComponents/inputs/InputEmail';
import InputText from '@app/uiComponents/inputs/InputText';
import ListForm from '@app/uiComponents/listForm/ListForm';
import {
	Center,
	Container, Fieldset,
	Grid,
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
						}}
						inputs={(submitButton) => <Fieldset legend="Personal information">
							<Grid>
								<Grid.Col span={12}>
									<InputText
										options={{
											required: 'Name is required',
											validate: (value: string) => {
												if (value !== 'mario') return 'It should say mario';
											}
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
									<InputEmail
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
