import { CreatifProvider } from '@root/CreatifProvider';
import LandingPage from '@root/uiApp/forms/LandingPage';
import LandingPageBanner from '@root/uiApp/forms/LandingPageBanner';
import { IconCashBanknote, IconHome } from '@tabler/icons-react';
import ButtonForm from '@root/uiApp/forms/ButtonForm';
export default function App() {
    return (
        <CreatifProvider
            apiKey="$2a$10$A40guY9o0lnh9cc.kIQL5edNcmvvpQ7DeccjC4rg59n9lvdCRdo4i"
            projectId="01HK5J0B21E6Z3TYE52QBKMT9S"
            app={{
                logo: 'Break free',
                items: [
                    {
                        menuText: 'Parks',
                        routePath: 'parks',

                        structureType: 'list',
                        structureName: 'Parks',

                        createComponent: <LandingPage structureName="Parks" />,
                        updateComponent: <LandingPage structureName="Parks" mode="update" />,
                    },
                    {
                        menuText: 'Buttons',
                        routePath: 'buttons',

                        structureType: 'map',
                        structureName: 'Buttons',

                        createComponent: <ButtonForm structureName="Buttons" />,
                        updateComponent: <ButtonForm structureName="Buttons" mode="update" />,
                    },
                    {
                        menuText: 'Ad banner',
                        routePath: 'add-banner',

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
