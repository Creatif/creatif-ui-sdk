import React from 'react';
import { CreatifProvider } from '../src/CreatifProvider';
import { NavigationForm } from './forms/landingPage/NavigationForm';

export default function App() {
    return (
        <CreatifProvider
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
