import SingleColumn from '@app/uiComponents/appShells/singleColumn/SingleColumn';
import ListForm from '@app/uiComponents/listForm/ListForm';
import { Center, Container, Input } from '@mantine/core';
import { CreatifProvider } from '@root/CreatifProvider';
import Content from '@root/uiApp/Content';
import { IconClipboardList, IconHome, IconSearch } from '@tabler/icons-react';
export default function App() {
	return (
		<CreatifProvider
			apiKey="$2a$10$gWY4A0NtaatYt3FngpNoLOIfsJR34EsLji8/6Y.Z8f6VpxNcOKEp."
			projectId="01HFSJ6D1PBS4M86QHS8CTQYM4"
			locale="hrv"
		>
			<Container fluid m={0} p={0}>
				<SingleColumn
					logo={<p>BEACH FRONT</p>}
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
