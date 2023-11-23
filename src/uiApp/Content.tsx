import ListForm from '@app/uiComponents/listForm/ListForm';
import {
	Button,
	Center,
	Container,
	Grid,
	Group,
	TextInput,
} from '@mantine/core';
import contentStyles from './css/content.module.css';

export default function Content() {
	return (
		<div className={contentStyles.root}>
			<Center>
				<Container size="lg" fluid>
					<ListForm
						listName="landing page"
						defaultValues={{
							name: 'title',
							bannerOne: 'Banner one',
							bannerTwo: 'Banner two',
						}}
					>
						<Grid align="center" justify="center">
							<Grid.Col span={12}>
								<TextInput
									label="Title"
									description="The title of this banner group"
									name="title"
								/>
							</Grid.Col>
							<Grid.Col span={6}>
								<TextInput
									label="Banner one"
									description="Banner to the left"
									name="banner1"
								/>
							</Grid.Col>
							<Grid.Col span={6}>
								<TextInput
									label="Banner two"
									description="Banner to the right"
									name="banner2"
								/>
							</Grid.Col>

							<Grid.Col span={12}>
								<Group justify="end">
									<Button>Create</Button>
								</Group>
							</Grid.Col>
						</Grid>
					</ListForm>
				</Container>
			</Center>
		</div>
	);
}
