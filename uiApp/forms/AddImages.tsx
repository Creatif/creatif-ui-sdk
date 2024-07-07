import { useFieldArray, useFormContext } from 'react-hook-form';
import { Image } from './Image';
import { InputFileFieldProps } from '../../src/app/uiComponents/form/BaseForm';
import React from 'react';
import { Button } from '@mantine/core';
import { File } from '../../src/app/uiComponents/inputs/fileUpload/File';

interface Props {
    inputImage: (props: InputFileFieldProps) => React.ReactNode;
}

export function AddImages({inputImage}: Props) {
    const {control} = useFormContext();
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control,
        name: "files",
    });

    return (
        <div style={{
            width: '100%'
        }}>
            {fields.map((field, index) => {
                return <div key={field.id} style={{
                    marginBottom: '16px'
                }}>
                    <File inputImage={inputImage} name={`files.${index}.name`} />
                    <Button variant="light" onClick={() => {
                        remove(index);
                    }}>Remove</Button>
                </div>
            })}

            <Button variant="subtle" onClick={() => {
                append({name: ''})
            }}>Add image</Button>
        </div>
    );
}