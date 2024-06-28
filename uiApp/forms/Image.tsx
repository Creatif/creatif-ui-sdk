import { InputImageFieldProps } from '../../src/app/uiComponents/shared/BaseForm';
import React, { useState } from 'react';

interface Props {
    inputImage: (props: InputImageFieldProps) => React.ReactNode;
    name: string;
}

export function Image({inputImage, name}: Props) {
    const [image, setImage] = useState('');
    return <div>
        {image && <img src={image} style={{
            objectFit: 'contain',
            width: '100%',
            height: '200px',
        }} />}
        {inputImage({
            name: name,
            onUploaded(base64: string) {
                setImage(base64);
            }
        })}
    </div>
}