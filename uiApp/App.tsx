import React from 'react';
import { CreatifProvider } from '../src/CreatifProvider';
import LanguageForm from './forms/LanguageForm';
import DeckForm from './forms/DeckForm';
import { AccountForm } from './forms/realEstate/AccountForm';
import { PropertyForm } from './forms/realEstate/PropertyForm';

export default function App() {
    return (
        <CreatifProvider
            app={{
                projectName: 'project',
                items: [
                    {
                        structureType: 'list',
                        structureName: 'Languages',
                        form: <LanguageForm />
                    },
                    {
                        structureType: 'list',
                        structureName: 'Properties',
                        form: <PropertyForm />
                    }
                ]
            }}
        />
    );
}
