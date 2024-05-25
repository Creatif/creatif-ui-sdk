import React from 'react';
import { CreatifProvider } from '../src/CreatifProvider';
import { PropertyForm } from './forms/realEstate/PropertyForm';
import { OwnerForm } from './forms/realEstate/OwnerForm';

export default function App() {
    return (
        <CreatifProvider
            app={{
                logo: 'Real Estate manager',
                projectName: 'Real Estate Manager',
                items: [
                    {
                        structureType: 'map',
                        structureName: 'Owners',
                        form: <OwnerForm />,
                    },
                    {
                        structureType: 'list',
                        structureName: 'Properties',
                        form: <PropertyForm />,
                    },
                ],
            }}
        />
    );
}
