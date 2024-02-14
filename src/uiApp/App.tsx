import React from 'react';
import LanguageForm from '@root/uiApp/forms/LanguageForm';
import DeckForm from '@root/uiApp/forms/DeckForm';
import { CreatifProvider } from '@app/CreatifProvider';

export default function App() {
    return (
        <CreatifProvider
            apiKey="$2a$10$KAd2gY6y8OWON52eeveR5.J1bVgygoFA32Y0g.JxYpcsQMBLjnhNS"
            projectId="01HPEWWTF30HRCH89ND95X46KC"
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
