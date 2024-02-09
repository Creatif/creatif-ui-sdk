import OrganizationForm from '@root/uiApp/forms/OrganizationForm';
import ProjectsForm from '@root/uiApp/forms/ProjectsForm';
import AttributesForm from '@root/uiApp/forms/AttributesForm';
import React from 'react';
import ColorForm from '@root/uiApp/forms/ColorForm';
import ListOrganizationForm from '@root/uiApp/forms/ListOrganizationForm';
import { CreatifProvider } from '@root/CreatifProvider';
import LanguageForm from '@root/uiApp/forms/LanguageForm';
import DeckForm from '@root/uiApp/forms/DeckForm';
import HomePageForm from '@root/uiApp/forms/HomePageForm';
import AboutPageForm from '@root/uiApp/forms/AboutPageForm';

export default function App() {
    return (
        <CreatifProvider
            apiKey="$2a$10$P1FzSAxBT0iH2yujjyUXfuyBRXrDsCfJW1TAzEebRhdBGx0/hkTIq"
            projectId="01HP6PRWFB5BGHT95Q500D4KC1"
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
