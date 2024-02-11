import React from 'react';
import { CreatifProvider } from '@root/CreatifProvider';
import LanguageForm from '@root/uiApp/forms/LanguageForm';
import DeckForm from '@root/uiApp/forms/DeckForm';

export default function App() {
    return (
        <CreatifProvider
            apiKey="$2a$10$KbdvpUmqEQG3ovv9rOVaIudukmI4lxmRtkuDVTY1JhuJioyNJQudC"
            projectId="01HPC81ZE13AD6WZ0FWMBD1K5G"
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
