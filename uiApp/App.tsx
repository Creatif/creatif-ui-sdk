import React from 'react';
import { CreatifProvider } from '../src/CreatifProvider';
import DeckForm from './forms/DeckForm';
import LanguageForm from './forms/LanguageForm';

export default function App() {
    return (
        <CreatifProvider
            app={{
                logo: 'Hotels',
                projectName: 'project',
                items: [
                    {
                        structureType: 'list',
                        structureName: 'Decks',
                        form: <DeckForm />,
                    },
                    {
                        structureType: 'list',
                        structureName: 'Languages',
                        form: <LanguageForm />,
                    },
                    {
                        structureType: 'map',
                        structureName: 'Map example',
                        form: <LanguageForm />,
                    },
                ],
            }}
        />
    );
}
