import { CreatifProvider } from '@root/CreatifProvider';
import LandingPage from '@root/uiApp/forms/LandingPage';
import LandingPageBanner from '@root/uiApp/forms/LandingPageBanner';
import { IconCashBanknote, IconHome } from '@tabler/icons-react';
export default function App() {
    return (
        <CreatifProvider
            apiKey="$2a$10$3nJCymRga4vl2aRWFBp2cOmLLNXkQYLntSQPjDY5riNcwgymaWYPy"
            projectId="01HJV5PZQZ0T5FP9JWVNSMNRWQ"
            app={{
                logo: 'Break free',
                items: [
                    {
                        menuText: 'Parks',
                        routePath: 'parks',
                        menuIcon: <IconHome size={20} />,

                        structureType: 'list',
                        structureName: 'Parks',

                        createComponent: <LandingPage structureName="Parks" />,
                        updateComponent: <LandingPage structureName="Parks" mode="update" />,
                    },
                    {
                        menuText: 'Ad banner',
                        routePath: 'add-banner',
                        menuIcon: <IconCashBanknote size={20} />,

                        structureName: 'add banner',
                        structureType: 'variable',
                        createComponent: <LandingPageBanner variableName="add banner" />,
                        updateComponent: <LandingPageBanner variableName="add banner" mode="update" />,
                    },
                ],
            }}
        />
    );
}
