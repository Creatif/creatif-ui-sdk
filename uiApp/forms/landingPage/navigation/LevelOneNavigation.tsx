import type { Control } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import React, { useEffect, useRef } from 'react';
import { InputCheckbox, InputText } from '../../../../src';
import { Button } from '@mantine/core';
import type { LevelControl } from '../Menus';

interface Props {
    currentIndex: number;
    control: Control;
    name: string;
    level: number;
    onParentControl: (levelControl: LevelControl) => void;
}

export function LevelOneNavigation({ control, name, onParentControl, level, currentIndex }: Props) {
    const { remove, fields, append } = useFieldArray({
        control,
        name: name,
    });

    const parentControlRef = useRef<LevelControl[]>([]);

    useEffect(() => {
        onParentControl({
            index: currentIndex,
            level,
            append,
            remove,
        });
    }, []);

    return fields.map((field, index) => (
        <div
            style={{
                padding: '1rem 0 1rem 1rem',
                display: 'flex',
                justifyContent: 'flex-start',
                flexDirection: 'column',
                gap: '1rem',
                marginBottom: '1rem',
                border: '1px solid var(--mantine-color-gray-3)',
                borderRadius: '6px',
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
                        remove(index);
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
    ));
}
