import React from 'react';
import { CreatifProvider } from '../src/CreatifProvider';
import LanguageForm from './forms/languageBuilder/LanguageForm';
import DeckForm from './forms/languageBuilder/DeckForm';
import { NavigationForm } from './forms/landingPage/NavigationForm';

export default function App() {
    return (
        <CreatifProvider
            app={{
                projectName: 'project',
                items: [
                    {
                        structureType: 'map',
                        structureName: 'Languages',
                        form: <NavigationForm />
                    },
                    {
                        structureType: 'map',
                        structureName: 'Decks',
                        form: <DeckForm />
                    },
                ]
            }}
        />
    );
}
