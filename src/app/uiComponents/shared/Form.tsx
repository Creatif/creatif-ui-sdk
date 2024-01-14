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
import type { InputGroupsProps } from '@app/uiComponents/inputs/InputGroups';
import { InputGroups } from '@app/uiComponents/inputs/InputGroups';
import InputBehaviour from '@app/uiComponents/inputs/InputBehaviour';
import type { QueriedListItem } from '@root/types/api/list';
import InputReference from '@app/uiComponents/inputs/InputReference';
import type { StructureType } from '@root/types/shell/shell';

export interface ReferenceInputProps {
    structureName: string;
    structureType: StructureType;
    label?: string;
    placeholder: string;
}

interface Props<T extends FieldValues> {
    structureId: string;
    structureType: string;
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
            inputGroups: (props?: InputGroupsProps) => React.ReactNode;
            inputBehaviour: () => React.ReactNode;
            inputReference: (props: ReferenceInputProps) => React.ReactNode;
        },
    ) => React.ReactNode;
    onSubmit: (value: T, e: BaseSyntheticEvent | undefined) => void;
    isSaving: boolean;
    mode: 'update' | undefined;
    currentData: GetVariableResponse | QueriedListItem | undefined;
}
export default function Form<T extends FieldValues>({
    structureType,
    structureId,
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
        setGroups(currentData.groups || ['default']);
        setBehaviour(currentData.behaviour);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        formProps.defaultValues = currentData.value;
    } else {
        setLocale(Initialize.Locale());
        setGroups(['default']);
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
                            inputGroups: (props?: InputGroupsProps) => (
                                <InputGroups
                                    structureType={structureType}
                                    structureId={structureId}
                                    store={useSpecialFields}
                                    {...props}
                                />
                            ),
                            inputBehaviour: () => <InputBehaviour store={useSpecialFields} />,
                            inputReference: (props: ReferenceInputProps) => (
                                <InputReference {...props} store={useSpecialFields} />
                            ),
                        },
                    )}
            </form>
        </FormProvider>
    );
}
