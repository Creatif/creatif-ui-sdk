import OrganizationForm from '@root/uiApp/forms/OrganizationForm';
import ProjectsForm from '@root/uiApp/forms/ProjectsForm';
import AttributesForm from '@root/uiApp/forms/AttributesForm';
import React from 'react';
import ColorForm from '@root/uiApp/forms/ColorForm';
import { CreatifProvider } from '@root/CreatifProvider';

export default function App() {
    return (
        <CreatifProvider
            apiKey="$2a$10$YvzNhpf4eepsQDkB5QaGkO9K5xrErEFxfczFK.8oJaIIEIpkL95iW"
            projectId="01HNFFP2YE5MXSD9E82VZF42EQ"
            app={{
                logo: 'Break free',
                items: [
                    {
                        structureType: 'map',
                        structureName: 'Organizations',

                        createComponent: <OrganizationForm />,
                        updateComponent: <OrganizationForm mode="update" />,
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
                    },
                ],
            }}
        />
    );
}
