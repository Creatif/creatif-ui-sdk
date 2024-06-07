import React from 'react';
import { CreatifProvider } from '../src/CreatifProvider';
import { AllFieldsForm } from './forms/AllFieldsForm';

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
                        form: <AllFieldsForm />,
                    },
                ],
            }}
        />
    );
}
