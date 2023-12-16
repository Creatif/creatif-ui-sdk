import { CreatifProvider } from '@root/CreatifProvider';
import LandingPage from '@root/uiApp/forms/LandingPage';
import LandingPageBanner from '@root/uiApp/forms/LandingPageBanner';
import { IconCashBanknote, IconHome } from '@tabler/icons-react';
export default function App() {
    return (
        <CreatifProvider
            apiKey="$2a$10$mb2bKfDLYalGVdqizmQ8x.rLKgJ2nPwEFHd3FSojXTzIKn/7hEfgi"
            projectId="01HHSQRWNS6CEGH8VB8V4C1F41"
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
