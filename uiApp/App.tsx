import React from 'react';
import { CreatifProvider } from '../src/CreatifProvider';
import LanguageForm from './forms/LanguageForm';
import DeckForm from './forms/DeckForm';

export default function App() {
    return (
        <CreatifProvider
            app={{
                logo: 'Real Estate manager',
                projectName: 'project',
                items: [
                    {
                        structureType: 'map',
                        structureName: 'Decks',
                        form: <DeckForm />,
                    },
                    {
                        structureType: 'list',
                        structureName: 'Languages',
                        form: <LanguageForm />,
                    },
                ],
            }}
        />
    );
}
