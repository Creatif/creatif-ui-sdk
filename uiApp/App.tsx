import React from 'react';
import { CreatifProvider } from '../src/CreatifProvider';
import { AccountForm } from './forms/realEstate/AccountForm';
import { PropertyForm } from './forms/realEstate/PropertyForm';

export default function App() {
    return (
        <CreatifProvider
            app={{
                logo: 'Real Estate Manager',
                projectName: 'project',
                items: [
                    {
                        structureType: 'map',
                        structureName: 'Accounts',
                        form: <AccountForm />,
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
