import { useCreatifFormContext } from '../../../src/index';
import { useCreatifFieldArray } from '../../../src/index';
import css from './css/root.module.css';
import { InputConnectionFieldProps } from '../../../src/app/uiComponents/form/BaseForm';
import React, { useEffect, useState } from 'react';
import { Button } from '@mantine/core';
import { InputCheckbox } from '../../../src';
import { useConnectionStore } from '../../../src/app/systems/stores/inputConnectionStore';
import { useCreatifWatch } from '../../../src';
import { useWatch } from 'react-hook-form';

interface Props {
    name: string;
    inputConnection: (props: InputConnectionFieldProps) => React.ReactNode;
}

export function ManagersArrayInput({name, inputConnection}: Props) {
    const { control } = useCreatifFormContext();
    const { fields, append, remove } = useCreatifFieldArray({
        control,
        name: name,
        shouldUnregister: true,
    });

    const watchedArray = useWatch({
        control,
        name: name,
    });

    useEffect(() => {
        if (fields.length !== 0) return;

        append({
            account: undefined,
            isSupervised: false,
        });
    }, [fields.length]);

    return <fieldset className={css.managersArray}>
        <legend>Choose managers</legend>

        {fields.map((field, index) => {
            const accountInputName = `${name}.${index}.account`;
            const supervisorInputName = `${name}.${index}.supervisor`;
            const checkboxName = `${name}.${index}.isSupervised`;

            return <div className={css.managersInputWrapper} key={field.id}>
                <div className={css.managersInput}>
                    {inputConnection({
                        structureName: 'Accounts',
                        name: accountInputName,
                        structureType: 'map',
                        label: 'Account',
                        options: {
                            required: 'Selecting an account to manage is required',
                        },
                    })}

                    <InputCheckbox  name={checkboxName} label="Should be supervised?" />

                    {watchedArray && watchedArray[index] && watchedArray[index].isSupervised && <div className={css.supervisorConnection}>
                        {inputConnection({
                            structureName: 'Managers',
                            name: supervisorInputName,
                            structureType: 'map',
                            label: 'Managers',
                            options: {
                                required: 'If checked, selecting a supervisor is required',
                            },
                        })}
                    </div>}
                </div>

                {fields.length >= 2 && <Button color="red" size="xs" variant="outline" onClick={() => {
                    remove(index);
                }}>Remove</Button>}
            </div>
        })}

        <div className={css.managersAddButton}>
            <Button size="xs" variant="outline" onClick={() => append({})}>Add manager</Button>
        </div>
    </fieldset>
}