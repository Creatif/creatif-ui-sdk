import { useCreatifFormContext } from '../../../src/index';
import { useCreatifFieldArray } from '../../../src/index';
import css from './css/root.module.css';
import { InputConnectionFieldProps } from '../../../src/app/uiComponents/form/BaseForm';
import React, { useEffect } from 'react';
import { Button } from '@mantine/core';
import { InputCheckbox } from '../../../src';
import { useConnectionStore } from '../../../src/app/systems/stores/inputConnectionStore';

interface Props {
    name: string;
    inputConnection: (props: InputConnectionFieldProps) => React.ReactNode;
}

export function ManagersArrayInput({name, inputConnection}: Props) {
    const { control } = useCreatifFormContext();
    const store = useConnectionStore();
    const { fields, append, remove } = useCreatifFieldArray({
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
            const inputName = `${name}.${index}.account`;
            return <div className={css.managersInput} key={field.id}>
                {inputConnection({
                    structureName: 'Accounts',
                    name: inputName,
                    key: field.id,
                    structureType: 'map',
                    label: 'Account',
                    options: {
                        required: 'Selecting an account to manage is required',
                    },
                })}

                <InputCheckbox name={`${name}.${index}.isSupervised`} label="Should be supervised?" />
                {fields.length >= 2 && <Button color="red" size="sm" variant="transparent" onClick={() => {
                    remove(index);
                    store.getState().remove(inputName);
                }}>Remove</Button>}
            </div>
        })}

        <div className={css.managersAddButton}>
            <Button size="sm" variant="transparent" onClick={() => append({})}>Add manager</Button>
        </div>
    </fieldset>
}