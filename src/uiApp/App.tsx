import React from 'react';
import LanguageForm from '@root/uiApp/forms/LanguageForm';
import DeckForm from '@root/uiApp/forms/DeckForm';
import { CreatifProvider } from '@root/CreatifProvider';

export default function App() {
    return (
        <CreatifProvider
            apiKey="$2a$10$tbvvxfzuBAUOzcMH64reru20KtuNPRnX9.R1jRsI/2.0GTe8TqPf6"
            projectId="01HQTYWV6VSMJ8Q2D95ZQMZ2XT"
            app={{
                logo: 'Break free',
                items: [
                    {
                        structureType: 'list',
                        structureName: 'Languages',
                        form: <LanguageForm />,
                    },
                    {
                        structureType: 'map',
                        structureName: 'Decks',
                        form: <DeckForm />,
                    },
                ],
            }}
        />
    );
}
