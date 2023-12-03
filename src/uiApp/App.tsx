import SingleColumn from '@app/uiComponents/appShells/singleColumn/SingleColumn';
import { CreatifProvider } from '@root/CreatifProvider';
import LandingPage from '@root/uiApp/forms/LandingPage';
import { IconHome } from '@tabler/icons-react';
export default function App() {
	return (
		<CreatifProvider
			apiKey="$2a$10$izv5d7ul8hXl0Vpl1DxdSuh/4Svd8GI9/t6s7mqgLPrW0NOG/hyZK"
			projectId="01HGR0NG93FBMW7S19VRZ4HJ8H"
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
