import React from 'react';
import { CreatifProvider } from '../src/CreatifProvider';
import LanguageForm from './forms/LanguageForm';
import DeckForm from './forms/DeckForm';

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
                        structureType: 'map',
                        structureName: 'Decks',
                        form: <DeckForm />
                    }
                ]
            }}
        />
    );
}
