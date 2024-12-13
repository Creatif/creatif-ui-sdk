import { File, useCreatifFormContext } from '../../../src/index';
import { useCreatifFieldArray } from '../../../src/index';
import css from './css/root.module.css';
import { InputConnectionFieldProps } from '../../../src/app/uiComponents/form/BaseForm';
import React, { useEffect } from 'react';
import { Button } from '@mantine/core';

interface Props {
    name: string;
    inputConnection: (props: InputConnectionFieldProps) => React.ReactNode;
    inputFile: any;
}

export function ManagersArrayInput({name, inputConnection, inputFile}: Props) {
    const { control, getValues } = useCreatifFormContext();
    const { fields, append, remove } = useCreatifFieldArray({
        control,
        name: name,
        shouldUnregister: true,
    });

    useEffect(() => {
        if (fields.length !== 0) return;

        append({
            client: undefined,
        });
    }, [fields.length]);

    return <fieldset className={css.managersArray}>
        <legend>Choose clients</legend>

        {fields.map((field, index) => {
            const clientInputName = `${name}.${index}.client`;
            const profileImageInputName = `${name}.${index}.profileImage`;

            return <div className={css.managersInputWrapper} key={field.id}>
                <div className={css.managersInput}>
                    <div className={css.removableConnection}>
                        {inputConnection({
                            structureName: 'Clients',
                            name: clientInputName,
                            structureType: 'map',
                            label: 'Client',
                        })}

                        {fields.length >= 2 && <Button styles={{
                            root: {
                                marginTop: '2.3rem',
                            }
                        }} color="red" size="xs" variant="outline" onClick={() => {
                            remove(index);
                        }}>Remove</Button>}
                    </div>
                </div>
            </div>
        })}

        <div className={css.managersAddButton}>
            <Button size="xs" variant="outline" onClick={() => append({
                client: undefined,
            })}>Add manager</Button>
        </div>
    </fieldset>
}