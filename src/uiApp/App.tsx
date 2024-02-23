import React from 'react';
import LanguageForm from '@root/uiApp/forms/LanguageForm';
import DeckForm from '@root/uiApp/forms/DeckForm';
import { CreatifProvider } from '@root/CreatifProvider';

export default function App() {
    return (
        <CreatifProvider
            apiKey="$2a$10$Z7bpTBiTSYjN/UHgtZnHpeAYy2xp3fwyQBOccyveBBijbC.X.8BGK"
            projectId="01HQB3VJ10XNAC3M4KVJVT6AZS"
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
