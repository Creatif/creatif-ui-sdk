import { Fieldset } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { SpecialFieldsStore } from '@app/systems/stores/specialFields';
import type { Behaviour } from '@root/types/api/shared';
import AppPill from '@app/uiComponents/shared/AppPill';
import { IconEyeOff, IconReplace } from '@tabler/icons-react';
export interface InputBehaviourProps {
    store: UseBoundStore<StoreApi<SpecialFieldsStore>>;
}
export default function InputBehaviour({ store }: InputBehaviourProps) {
    const { control, setValue: setFormValue } = useFormContext();
    const [value, setValue] = useState<Behaviour>(store.getState().behaviour || 'modifiable');

    const name = 'creatif_behaviour';

    useEffect(() => {
        store.getState().addField(name);
        setFormValue('behaviour', value);

        return () => store.getState().removeField(name);
    }, []);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange } }) => (
                <Fieldset
                    legend="Behaviour"
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        gap: '1rem',
                    }}>
                    <AppPill
                        selected={value === 'modifiable'}
                        onChange={(value) => {
                            setFormValue('behaviour', value);
                            onChange(value);
                            setValue(value as Behaviour);
                        }}
                        icon={<IconReplace size={16} />}
                        value="modifiable"
                        text="Modifiable"
                    />

                    <AppPill
                        selected={value === 'readonly'}
                        onChange={(value) => {
                            setFormValue(name, value);
                            onChange(value);
                            setValue(value as Behaviour);
                        }}
                        icon={<IconEyeOff size={16} />}
                        value="readonly"
                        text="Readonly"
                    />
                </Fieldset>
            )}
        />
    );
}
