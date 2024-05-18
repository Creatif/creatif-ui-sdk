import React from 'react';
import { CreatifProvider } from '../src/CreatifProvider';
import { NavigationForm } from './forms/landingPage/NavigationForm';

export default function App() {
    return (
        <CreatifProvider
            apiKey="$2a$10$1UDkF.6jZohmd6WCNwj9Le5id4DCP..uUmJzqlO09GwHnGZzdff26"
            projectId="01HY3TFMTAS8BV50Z9P6D6FC2H"
            app={{
                logo: 'Hotels',
                items: [
                    {
                        structureType: 'list',
                        structureName: 'Navigations',
                        form: <NavigationForm />,
                    },
                ],
            }}
        />
    );
}
