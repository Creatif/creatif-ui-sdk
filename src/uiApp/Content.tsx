import InputCheckbox from '@app/uiComponents/inputs/InputCheckbox';
import InputText from '@app/uiComponents/inputs/InputText';
import InputTextarea from '@app/uiComponents/inputs/InputTextarea';
import ListForm from '@app/uiComponents/listForm/ListForm';
import {
	Button,
	Center,
	Container,
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
							title: '',
							banner1: '',
							banner2: '',
							acceptTerms: false,
						}}
						inputs={(submitButton) => <Grid align="center" justify="center">
							<Grid.Col span={12}>
								<InputText
									options={{
										required: 'Title is required'
									}}
									structureName="landing page"
									label="Title"
									description="The title of this banner group"
									name="title"
								/>
							</Grid.Col>
							<Grid.Col span={6}>
								<InputTextarea
									options={{
										required: 'This field is required',
									}}
									structureName="landing page"
									label="Banner one"
									description="Banner to the left"
									name="banner1"
								/>
							</Grid.Col>
							<Grid.Col span={6}>
								<InputTextarea
									options={{
										required: 'This field is required',
									}}
									structureName="landing page"
									label="Banner two"
									description="Banner to the right"
									name="banner2"
								/>
							</Grid.Col>
							<Grid.Col span={6}>
								<InputCheckbox
									options={{
										required: 'This field is required',
									}}
									structureName="landing page"
									label="Accept terms"
									description="Accept this shitty terms"
									name="acceptTerms"
								/>
							</Grid.Col>

							<Grid.Col span={12}>
								{submitButton}
							</Grid.Col>
						</Grid>}
					/>
				</Container>
			</Center>
		</div>
	);
}
