import React from 'react';
import { CreatifProvider } from '../src/CreatifProvider';
import { PropertyForm } from './forms/realEstate/PropertyForm';
import { AccountForm } from './forms/realEstate/AccountForm';

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
                ],
            }}
        />
    );
}
