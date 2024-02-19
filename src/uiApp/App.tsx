import React from 'react';
import LanguageForm from '@root/uiApp/forms/LanguageForm';
import DeckForm from '@root/uiApp/forms/DeckForm';
import { CreatifProvider } from '@root/CreatifProvider';

export default function App() {
    return (
        <CreatifProvider
            apiKey="$2a$10$mbSuTe6tYkXbaf/q2MKkoOdxJ5BwTd3wn6bX1mS9AzsbFFzIS8h0i"
            projectId="01HQ02PP6XQW275WRW0ZRXBN5Z"
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
