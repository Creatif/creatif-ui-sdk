import SingleColumn from '@app/uiComponents/appShells/singleColumn/SingleColumn';
import { CreatifProvider } from '@root/CreatifProvider';
import LandingPage from '@root/uiApp/forms/LandingPage';
import { IconHome } from '@tabler/icons-react';
export default function App() {
	return (
		<CreatifProvider
			apiKey="$2a$10$EbUbCiuHQiulgnvllemQ5Op1N3QnTbTKMKBCYAH0sKYlNBY7Vx40."
			projectId="01HHCZFF53YBFGNJXAZ1WW7NVD">
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
								component: <LandingPage structureName="landing page" mode="update" />,
							},
						},
					],
				}}
			/>
		</CreatifProvider>
	);
}
