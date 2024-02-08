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
            apiKey="$2a$10$rKTBZr0UMaK1JQw08efMAe2MV9G5t4J92Rhl8I.5Yp3lRLLWsNen6"
            projectId="01HP4MXRJMDHP1CGNRW43073NH"
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
