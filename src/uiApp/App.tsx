import { CreatifProvider } from '@root/CreatifProvider';
import OrganizationForm from '@root/uiApp/forms/OrganizationForm';
import ProjectsForm from '@root/uiApp/forms/ProjectsForm';
export default function App() {
    return (
        <CreatifProvider
            apiKey="$2a$10$QtePipfMUKWOBxKjti6mx./o8oJQfRcSaR0xtRVcKduXZMUuQtkT2"
            projectId="01HMKVB4KPW81MF4YM5GN3EXDM"
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
