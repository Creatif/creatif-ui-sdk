import OrganizationForm from '@root/uiApp/forms/OrganizationForm';
import ProjectsForm from '@root/uiApp/forms/ProjectsForm';
import AttributesForm from '@root/uiApp/forms/AttributesForm';
import React from 'react';
import ColorForm from '@root/uiApp/forms/ColorForm';
import ListOrganizationForm from '@root/uiApp/forms/ListOrganizationForm';
import { CreatifProvider } from '@root/CreatifProvider';
import LanguageForm from '@root/uiApp/forms/LanguageForm';
import DeckForm from '@root/uiApp/forms/DeckForm';

export default function App() {
    return (
        <CreatifProvider
            apiKey="$2a$10$s3kuHNg4cBEdtIt8S09z9.786BTQowpCBg.PZlZYLVzW1Yr5i98za"
            projectId="01HP000KWQWMW0HW6WTN12WZ3Z"
            app={{
                logo: 'Break free',
                items: [
                    {
                        structureType: 'list',
                        structureName: 'Languages',

                        createComponent: <LanguageForm />,
                        updateComponent: <LanguageForm mode="update" />,
                    },
                    {
                        structureType: 'map',
                        structureName: 'Decks',

                        createComponent: <DeckForm />,
                        updateComponent: <DeckForm mode="update" />,
                    },
                    /*                    {
                        structureType: 'map',
                        structureName: 'Organizations',

                        createComponent: <OrganizationForm />,
                        updateComponent: <OrganizationForm mode="update" />,
                    },
                    {
                        structureType: 'list',
                        structureName: 'List organizations',
                        menuText: 'List organizations',

                        createComponent: <ListOrganizationForm />,
                        updateComponent: <ListOrganizationForm mode="update" />,
                    },
                    {
                        structureType: 'map',
                        structureName: 'Attributes',

                        createComponent: <AttributesForm />,
                        updateComponent: <AttributesForm mode="update" />,
                    },
                    {
                        structureType: 'map',
                        structureName: 'Colors',

                        createComponent: <ColorForm />,
                        updateComponent: <ColorForm mode="update" />,
                    },
                    {
                        structureType: 'map',
                        structureName: 'Projects',

                        createComponent: <ProjectsForm />,
                        updateComponent: <ProjectsForm mode="update" />,
                    },*/
                ],
            }}
        />
    );
}
