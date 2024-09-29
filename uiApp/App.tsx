import React from 'react';
import { CreatifProvider } from '../src/CreatifProvider';
import ImageForm from './forms/languageBuilder/ImageForm';

export default function App() {
    return (
        <CreatifProvider
            app={{
                projectName: 'project',
                items: [
                    {
                        structureType: 'map',
                        structureName: 'Images',
                        form: <ImageForm />
                    },
                ]
            }}
        />
    );
}
