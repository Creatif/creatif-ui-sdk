import SingleColumn from '@app/uiComponents/appShells/singleColumn/SingleColumn';
import { CreatifProvider } from '@root/CreatifProvider';
import LandingPage from '@root/uiApp/forms/LandingPage';
import { IconHome } from '@tabler/icons-react';
export default function App() {
	return (
		<CreatifProvider
			apiKey="$2a$10$.y8Q7TWw3RNRKfZTOTLmgO7Y6oCsTaD7IIZ/.Hfe2c0FU.wZ4OQ7m"
			projectId="01HH4375DTYW0RTXR5R71HW86V"
			locale="hrv"
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
