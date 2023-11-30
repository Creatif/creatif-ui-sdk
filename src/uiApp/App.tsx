import SingleColumn from '@app/uiComponents/appShells/singleColumn/SingleColumn';
import { Container } from '@mantine/core';
import { CreatifProvider } from '@root/CreatifProvider';
import Content from '@root/uiApp/Content';
import { IconClipboardList, IconHome, IconSearch } from '@tabler/icons-react';
export default function App() {
	return (
		<CreatifProvider
			apiKey="$2a$10$X5cR4UOKnIMAtzEaMPj.4ed1CYpYxkArKyil08C1Y6Nza71R1.Aqa"
			projectId="01HGFD0FD01JAYSRECR5T4ZH8R"
			locale="hrv"
		>
			<Container fluid m={0} p={0}>
				<SingleColumn
					logo={<p>BEACH FRONT</p>}
					header={<p>header</p>}
					navItems={[
						{
							text: 'Landing page',
							navigateTo: '/',
							icon: <IconHome size="1.5rem" />,
						},
						{
							text: 'Search items page',
							navigateTo: '/',
							icon: <IconSearch size="1.5rem" />,
						},
						{
							text: 'Item page',
							navigateTo: '/',
							icon: <IconClipboardList />,
						},
					]}
				>
					<Content />
				</SingleColumn>
			</Container>
		</CreatifProvider>
	);
}
