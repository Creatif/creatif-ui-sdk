import { CreatifProvider } from '@root/CreatifProvider';
import OrganizationForm from '@root/uiApp/forms/OrganizationForm';
import ProjectsForm from '@root/uiApp/forms/ProjectsForm';
import AttributesForm from '@root/uiApp/forms/AttributesForm';
import React from 'react';
import ColorForm from '@root/uiApp/forms/ColorForm';
export default function App() {
    return (
        <CreatifProvider
            apiKey="$2a$10$voGIGOAaeGzCF6rSxGjk6.ZU8atQ3M/vHd.usovYxrmYD.T9N5COK"
            projectId="01HN7J39QGDVRYP7QGHSPMYB3V"
            app={{
                logo: 'Break free',
                items: [
                    {
                        menuText: 'Organizations',
                        routePath: 'organizations',

                        structureType: 'map',
                        structureName: 'Organizations',

                        createComponent: <OrganizationForm structureName="Organizations" />,
                        updateComponent: <OrganizationForm structureName="Organizations" mode="update" />,
                    },
                    {
                        menuText: 'Attributes',
                        routePath: 'attributes',

                        structureType: 'map',
                        structureName: 'Attributes',

                        createComponent: <AttributesForm structureName="Attributes" />,
                        updateComponent: <AttributesForm structureName="Attributes" mode="update" />,
                    },
                    {
                        menuText: 'Colors',
                        routePath: 'colors',

                        structureType: 'map',
                        structureName: 'Colors',

                        createComponent: <ColorForm structureName="Colors" />,
                        updateComponent: <ColorForm structureName="Colors" mode="update" />,
                    },
                    {
                        menuText: 'Projects',
                        routePath: 'projects',

                        structureType: 'map',
                        structureName: 'Projects',

                        createComponent: <ProjectsForm structureName="Projects" />,
                        updateComponent: <ProjectsForm structureName="Projects" mode="update" />,
                    },
                ],
            }}
        />
    );
}
