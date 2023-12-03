import SingleColumn from '@app/uiComponents/appShells/singleColumn/SingleColumn';
import { CreatifProvider } from '@root/CreatifProvider';
import LandingPage from '@root/uiApp/forms/LandingPage';
import { IconHome } from '@tabler/icons-react';
export default function App() {
	return (
		<CreatifProvider
			apiKey="$2a$10$2aLurymruPh90HSHfPAOKOCvazK095fA9aJTvn4O0SKew1ed94QR."
			projectId="01HGNVKRY7TCBJFVEPZE2XE2C8"
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
							create: {
								component: <LandingPage structureName="landing page" />,
								structure: {
									name: 'landing page',
									type: 'list',
								}
							}
						},
					]
				}}
			/>
		</CreatifProvider>
	);
}
