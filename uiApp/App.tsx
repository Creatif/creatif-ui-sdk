import React from 'react';
import { CreatifProvider } from '../src/CreatifProvider';
import { ClientForm } from './forms/realEstate/ClientForm';
import { PropertyForm } from './forms/realEstate/PropertyForm';
import { ManagerForm } from './forms/realEstate/ManagerForm';

export default function App() {
    return (
        <CreatifProvider
            app={{
                projectName: 'project',
                items: [
                    {
                        structureType: 'map',
                        structureName: 'Clients',
                        form: <ClientForm />
                    },
                    {
                        structureType: 'map',
                        structureName: 'Managers',
                        form: <ManagerForm />
                    },
                    {
                        structureType: 'list',
                        structureName: 'Properties',
                        form: <PropertyForm />
                    },
                ]
            }}
        />
    );
}
