import { useCreatifFormContext } from '../../../src/index';
import { useCreatifFieldArray } from '../../../src/index';
import css from './css/root.module.css';
import { InputConnectionFieldProps } from '../../../src/app/uiComponents/form/BaseForm';
import React, { useEffect, useState } from 'react';
import { Button } from '@mantine/core';
import { InputCheckbox } from '../../../src';
import { useConnectionStore } from '../../../src/app/systems/stores/inputConnectionStore';
import { useCreatifWatch } from '../../../src';

interface Props {
    name: string;
    inputConnection: (props: InputConnectionFieldProps) => React.ReactNode;
}

export function ManagersArrayInput({name, inputConnection}: Props) {
    const { control, formState: {errors} } = useCreatifFormContext();
    const store = useConnectionStore();
    const { fields, append, remove } = useCreatifFieldArray({
        control,
        name: name,
    });

    const [shouldBeSupervised, setShouldBeSupervised] = useState<number>();

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
            const supervisorInputName = `${name}.${index}.supervisor`
            return <div className={css.managersInputWrapper} key={field.id}>
                <div className={css.managersInput}>
                    {inputConnection({
                        structureName: 'Accounts',
                        name: accountInputName,
                        key: field.id,
                        structureType: 'map',
                        label: 'Account',
                        options: {
                            required: 'Selecting an account to manage is required',
                        },
                    })}

                    <InputCheckbox onClick={() => setShouldBeSupervised(index)} name={`${name}.${index}.isSupervised`} label="Should be supervised?" />

                    {Number.isInteger(shouldBeSupervised) && inputConnection({
                        structureName: 'Managers',
                        name: supervisorInputName,
                        key: field.id,
                        structureType: 'map',
                        label: 'Managers',
                        options: {
                            required: 'Selecting a supervisor is required',
                        },
                    })}
                </div>

                {fields.length >= 2 && <Button color="red" size="xs" variant="outline" onClick={() => {
                    remove(index);
                    store.getState().remove(accountInputName);
                }}>Remove</Button>}
            </div>
        })}

        <div className={css.managersAddButton}>
            <Button size="xs" variant="outline" onClick={() => append({})}>Add manager</Button>
        </div>
    </fieldset>
}