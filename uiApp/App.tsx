import React from 'react';
import { CreatifProvider } from '../src/CreatifProvider';
import { RegionsForm } from './forms/hotel/RegionsForm';

export default function App() {
    return (
        <CreatifProvider
            apiKey="$2a$10$3j58zLNQdzso41Al0wE0NOtaImVL5XxtHsdMvrCK0yDmbiX15mchq"
            projectId="01HSV503TW8AVKNW4ZHH43JX38"
            app={{
                logo: 'Hotels',
                items: [
                    {
                        structureType: 'map',
                        structureName: 'Regions',
                        form: <RegionsForm />,
                    },
                ],
            }}
        />
    );
}
