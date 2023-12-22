import { FormProvider, useForm } from 'react-hook-form';
import type {
    FieldValues,
    UseFormProps,
    UseFormGetFieldState,
    UseFormGetValues,
    UseFormReset,
    UseFormResetField,
    UseFormSetError,
    UseFormSetFocus,
    UseFormSetValue,
    UseFormTrigger,
    UseFormUnregister,
    UseFormWatch,
} from 'react-hook-form';
import { Button, Group } from '@mantine/core';
import type { InputLocaleProps } from '@app/uiComponents/inputs/InputLocale';
import InputLocale from '@app/uiComponents/inputs/InputLocale';
import type { BaseSyntheticEvent } from 'react';
import React from 'react';
import { createSpecialFields } from '@app/systems/stores/specialFields';
import type { GetVariableResponse } from '@root/types/api/variable';
import { Initialize } from '@app/initialize';

interface Props<T extends FieldValues> {
    formProps: UseFormProps<T>;
    inputs: (
        submitButton: React.ReactNode,
        actions: {
            setValue: UseFormSetValue<T>;
            getValues: UseFormGetValues<T>;
            setFocus: UseFormSetFocus<T>;
            setError: UseFormSetError<T>;
            reset: UseFormReset<T>;
            resetField: UseFormResetField<T>;
            unregister: UseFormUnregister<T>;
            watch: UseFormWatch<T>;
            trigger: UseFormTrigger<T>;
            getFieldState: UseFormGetFieldState<T>;
            defaultValues: T;
            inputLocale: (props?: InputLocaleProps) => React.ReactNode;
        },
    ) => React.ReactNode;
    onSubmit: (value: T, e: BaseSyntheticEvent | undefined) => void;
    isSaving: boolean;
    mode: 'update' | undefined;
    currentData: GetVariableResponse | undefined;
}
export default function Form<T extends FieldValues>({
    formProps,
    inputs,
    onSubmit,
    isSaving,
    currentData,
    mode,
}: Props<T>) {
    const useSpecialFields = createSpecialFields();
    const setLocale = useSpecialFields((state) => state.setLocale);
    const setGroups = useSpecialFields((state) => state.setGroups);
    const setBehaviour = useSpecialFields((state) => state.setBehaviour);

    if (mode === 'update' && currentData) {
        setLocale(currentData.locale);
        setGroups(currentData.groups || []);
        setBehaviour(currentData.behaviour);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        formProps.defaultValues = currentData.value;
    } else {
        setLocale(Initialize.Locale());
    }
    const methods = useForm(formProps);

    const {
        setValue,
        getValues,
        setError,
        setFocus,
        reset,
        resetField,
        unregister,
        watch,
        trigger,
        getFieldState,
        formState: { isLoading },
    } = methods;

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                {!isLoading &&
                    inputs(
                        <Group justify="end">
                            <Button loaderProps={{ size: 14 }} loading={isSaving} type="submit">
                                {mode && 'Update'}
                                {!mode && 'Create'}
                            </Button>
                        </Group>,
                        {
                            setValue: setValue,
                            getValues: getValues,
                            setFocus: setFocus,
                            setError: setError,
                            reset: reset,
                            resetField: resetField,
                            unregister: unregister,
                            watch: watch,
                            trigger: trigger,
                            getFieldState: getFieldState,
                            defaultValues: getValues(),
                            inputLocale: (props?: InputLocaleProps) => (
                                <InputLocale {...props} store={useSpecialFields} />
                            ),
                        },
                    )}
            </form>
        </FormProvider>
    );
}
