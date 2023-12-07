import SingleColumn from '@app/uiComponents/appShells/singleColumn/SingleColumn';
import { CreatifProvider } from '@root/CreatifProvider';
import LandingPage from '@root/uiApp/forms/LandingPage';
import { IconHome } from '@tabler/icons-react';
export default function App() {
	return (
		<CreatifProvider
			apiKey="$2a$10$LCx2kEVLBozDFpXULgT0Cu7qWGQhWV0nMbOf0FjgPKzp84eT5nFIK"
			projectId="01HH2FRH61WC1K4QHAMYAPN2TY"
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
						},
					],
				}}
			/>
		</CreatifProvider>
	);
}
