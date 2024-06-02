import type { FieldValues, UseFieldArrayAppend, UseFieldArrayRemove } from 'react-hook-form';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { InputText, InputCheckbox } from '../../../src';
import { Button } from '@mantine/core';
import React, { useRef } from 'react';
import { LevelOneNavigation } from './navigation/LevelOneNavigation';

interface Props {
    name: string;
}

export interface LevelControl {
    index: number;
    level: number;
    append: UseFieldArrayAppend<FieldValues>;
    remove: UseFieldArrayRemove;
}

export function Menus({ name }: Props) {
    const { control } = useFormContext();
    const { append, fields } = useFieldArray({
        control,
        name: name,
    });

    const level = 1;

    const parentControlRef = useRef<LevelControl[]>([]);

    return (
        <>
            {fields.map((field, index) => (
                <div
                    style={{
                        padding: '0 0 1rem 1rem',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        flexDirection: 'column',
                        gap: '1rem',
                        marginBottom: '1rem',
                    }}
                    key={field.id}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            alignContent: 'center',
                            gap: '1rem',
                        }}>
                        <InputText
                            options={{
                                required: 'Top level name is required',
                            }}
                            name={`${name}.${index}.topLevelName`}
                            label="Top level name"
                            placeholder="Top level name"
                        />

                        <InputText name={`${name}.${index}.href`} label="Link" placeholder="Link" />

                        <InputCheckbox name={`${name}.${index}.newTab`} label="Open in new tab?" />
                    </div>

                    <LevelOneNavigation
                        currentIndex={index}
                        level={level + 1}
                        onParentControl={(levelControl) => {
                            parentControlRef.current.push(levelControl);
                        }}
                        name={`${name}.${index}.level${level + 1}`}
                        control={control}
                    />

                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            gap: '1rem',
                        }}>
                        <p>
                            {level} {index}
                        </p>
                        <Button
                            variant="white"
                            size="compact-xs"
                            color="red"
                            onClick={() => {
                                if (parentControlRef.current) {
                                    for (const ctrl of parentControlRef.current) {
                                        if (ctrl.level === level + 1 && ctrl.index === index) {
                                            ctrl.remove(index);
                                        }
                                    }
                                }
                            }}>
                            Delete
                        </Button>

                        <Button
                            variant="outline"
                            size="compact-xs"
                            onClick={() => {
                                if (parentControlRef.current) {
                                    for (const ctrl of parentControlRef.current) {
                                        if (ctrl.level === level + 1 && ctrl.index === index) {
                                            ctrl.append({ topLevelName: '', href: '', newTab: false });
                                            return;
                                        }
                                    }
                                }
                            }}>
                            Add sub menu
                        </Button>
                    </div>
                </div>
            ))}

            <Button
                style={{
                    marginTop: '1rem',
                }}
                variant="outline"
                onClick={() => {
                    append({ topLevelName: '', href: '', newTab: false });
                }}>
                Add top level menu
            </Button>
        </>
    );
}
