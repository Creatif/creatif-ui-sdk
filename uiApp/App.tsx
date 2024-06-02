import React from 'react';
import { CreatifProvider } from '../src/CreatifProvider';
import { PropertyForm } from './forms/realEstate/PropertyForm';
import { OwnerForm } from './forms/realEstate/OwnerForm';

export default function App() {
    return (
        <CreatifProvider
            app={{
                logo: 'Real Estate Manager',
                projectName: 'project',
                items: [
                    {
                        structureType: 'map',
                        structureName: 'Properties',
                        form: <PropertyForm />,
                    },
                    {
                        structureType: 'map',
                        structureName: 'Accounts',
                        form: <OwnerForm />,
                    },
                ],
            }}
        />
    );
}
