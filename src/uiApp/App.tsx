import { CreatifProvider } from '@root/CreatifProvider';
import LandingPage from '@root/uiApp/forms/LandingPage';
import LandingPageBanner from '@root/uiApp/forms/LandingPageBanner';
import { IconCashBanknote, IconHome } from '@tabler/icons-react';
export default function App() {
    return (
        <CreatifProvider
            apiKey="$2a$10$i7Y3Mu8lERQjnBzunz0LHOvfnGvG2QkaJ6GLwfhZZ4XlnlTQfyFoa"
            projectId="01HJ8R3WXDZWQBXZBZGH289VRC"
            app={{
                logo: 'Break free',
                items: [
                    {
                        menu: {
                            text: 'Landing page',
                            path: 'landing-page',
                            icon: <IconHome size={20} />,
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
                            icon: <IconCashBanknote size={20} />,
                        },
                        structure: {
                            name: 'landing page banner',
                            type: 'variable',
                        },
                        create: {
                            component: <LandingPageBanner variableName="landing page banner" />,
                        },
                        update: {
                            component: <LandingPageBanner variableName="landing page banner" mode="update" />,
                        },
                    },
                ],
            }}
        />
    );
}
