import React from 'react';
import { CreatifProvider } from '../src/CreatifProvider';
import { PropertyForm } from './forms/realEstate/PropertyForm';
import { AccountForm } from './forms/realEstate/AccountForm';

export default function App() {
    return (
        <CreatifProvider
            app={{
                projectName: 'project',
                items: [
                    {
                        structureType: 'list',
                        structureName: 'Property',
                        form: <PropertyForm />
                    }
                ]
            }}
        />
    );
}
