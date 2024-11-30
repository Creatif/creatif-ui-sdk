import { useCreatifFieldArray, useCreatifFormContext } from '../../../src';
import css from './css/root.module.css';
import React, { useEffect } from 'react';
import { InputConnectionFieldProps } from '../../../src/app/uiComponents/form/BaseForm';
import { Button } from '@mantine/core';
import { Control, FieldValues } from 'react-hook-form';

interface Props {
    index: number;
    parentName: string;
    inputConnection: (props: InputConnectionFieldProps) => React.ReactNode;
    control: Control
}

export function SupervisorsArrayInput({index, parentName, inputConnection, control}: Props) {
    const parent = `${parentName}.${index}.supervisors`;

    const { fields, append, remove } = useCreatifFieldArray({
        control,
        name: parent,
        shouldUnregister: true,
    });

    useEffect(() => {
        if (fields.length !== 0) return;

        append({
            supervisor: undefined,
        });
    }, [fields.length]);

    const connectionName = `${parent}.${index}.supervisor`;

    return <div className={css.supervisorWrapper}>
        {fields.map((field, index) => {
            return <div key={field.id} className={css.singleSupervisorEntry}>
                {inputConnection({
                    structureName: 'Managers',
                    name: connectionName,
                    structureType: 'map',
                    label: 'Supervisor',
                })}

                {fields.length >= 2 && <Button color="red" size="xs" variant="outline" onClick={() => {
                    remove(index);
                }}>Remove</Button>}
            </div>
        })}

        <div className={css.managersAddButton}>
            <Button size="xs" variant="outline" onClick={() => append({
                supervisor: undefined,
            })}>Add supervisor</Button>
        </div>
    </div>;
}