import React from 'react';
import { CreatifProvider } from '../src/CreatifProvider';
import { RegionsForm } from './forms/hotel/RegionsForm';
import { ManagersForm } from './forms/hotel/ManagersForm';
import { CategoriesForm } from './forms/hotel/CategoriesForm';
import { PropertiesForm } from './forms/hotel/PropertiesForm';

export default function App() {
    return (
        <CreatifProvider
            apiKey="$2a$10$3j58zLNQdzso41Al0wE0NOtaImVL5XxtHsdMvrCK0yDmbiX15mchq"
            projectId="01HSV503TW8AVKNW4ZHH43JX38"
            app={{
                logo: 'Hotels',
                items: [
                    {
                        structureType: 'map',
                        structureName: 'Regions',
                        form: <RegionsForm />,
                    },
                    {
                        structureType: 'map',
                        structureName: 'Managers',
                        form: <ManagersForm />,
                    },
                    {
                        structureType: 'map',
                        structureName: 'Categories',
                        form: <CategoriesForm />,
                    },
                    {
                        structureType: 'map',
                        structureName: 'Properties',
                        form: <PropertiesForm />,
                    },
                ],
            }}
        />
    );
}
