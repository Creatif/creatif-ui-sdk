import SingleColumn from '@app/uiComponents/appShells/singleColumn/SingleColumn';
import { CreatifProvider } from '@root/CreatifProvider';
import LandingPage from '@root/uiApp/forms/LandingPage';
import { IconHome } from '@tabler/icons-react';
export default function App() {
	return (
		<CreatifProvider
			apiKey="$2a$10$8l799gyW1zxeGu/T/vW.MuEaWnUxIKCX8XwgHM8e0TE3KSv0vojFK"
			projectId="01HH9E247K7XBPNZ30RC63TQQC"
		>
			<SingleColumn
				options={{
					logo: 'BEACH FRONT',
					header: <p>Header</p>,
					items: [
						{
							menu: {
								text: 'Landing page',
								path: 'landing-page',
								icon: <IconHome size="1.5rem" />,
							},
							structure: {
								name: 'landing page',
								type: 'list',
							},
							create: {
								component: <LandingPage structureName="landing page" />,
							},
							update: {
								component: (
									<LandingPage structureName="landing page" mode="update" />
								),
							},
						},
					],
				}}
			/>
		</CreatifProvider>
	);
}
