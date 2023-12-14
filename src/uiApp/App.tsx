import { CreatifProvider } from '@root/CreatifProvider';
import LandingPage from '@root/uiApp/forms/LandingPage';
import { IconCashBanknote, IconHome } from '@tabler/icons-react';
export default function App() {
    return (
        <CreatifProvider
            apiKey="$2a$10$EbUbCiuHQiulgnvllemQ5Op1N3QnTbTKMKBCYAH0sKYlNBY7Vx40."
            projectId="01HHCZFF53YBFGNJXAZ1WW7NVD"
            app={{
                logo: 'Break free',
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
                    {
                        menu: {
                            text: 'Landing page banner',
                            path: 'landing-page-banner',
                            icon: <IconCashBanknote size="1.5rem" />,
                        },
                        structure: {
                            name: 'landing page banner',
                            type: 'variable',
                        },
                        create: {
                            component: <div>Create</div>,
                        },
                        update: {
                            component: <div>Update</div>,
                        },
                    },
                ],
            }}
        />
    );
}
