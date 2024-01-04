import { CreatifProvider } from '@root/CreatifProvider';
import LandingPage from '@root/uiApp/forms/LandingPage';
import LandingPageBanner from '@root/uiApp/forms/LandingPageBanner';
import ButtonForm from '@root/uiApp/forms/ButtonForm';
export default function App() {
    return (
        <CreatifProvider
            apiKey="$2a$10$PsQUacjt2How34BHHu0Sv.za4825C/5KEasbCUykIg0HriTfjhEI6"
            projectId="01HKARSQ8S5T6T9PSRHCZC3N4Z"
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
