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
    UseFormStateReturn,
    UseFormRegister,
} from 'react-hook-form';
import type { ButtonProps, FileButtonProps } from '@mantine/core';
import { InputLocale } from '@app/uiComponents/inputs/InputLocale';
import type { BaseSyntheticEvent } from 'react';
import React, { useCallback } from 'react';
import type { SpecialFieldsStore } from '@app/systems/stores/specialFields';
import type { GetVariableResponse } from '@root/types/api/variable';
import { InputGroups } from '@app/uiComponents/inputs/InputGroups';
import { InputBehaviour } from '@app/uiComponents/inputs/InputBehaviour';
import type { QueriedListItem } from '@root/types/api/list';
import { InputConnection } from '@app/uiComponents/inputs/InputConnection';
import type { StructureType } from '@root/types/shell/shell';
import type { RegisterOptions } from 'react-hook-form/dist/types/validator';
import type { QueriedMapItem } from '@root/types/api/map';
import type { StoreApi, UseBoundStore } from 'zustand';
import { Runtime } from '@app/systems/runtime/Runtime';
import { FileUploadButton } from '@app/uiComponents/inputs/fileUpload/FileUploadButton';
import type { ImagePathsStoreData } from '@app/systems/stores/imagePaths';
import type { GlobalLoadingStore } from '@app/systems/stores/globalLoading';
import { SubmitButton } from '@app/uiComponents/form/SubmitButton';
import type { Attachment } from '@root/types/forms/forms';
import type { ConnectionStore } from '@app/systems/stores/inputConnectionStore';

export interface InputConnectionFieldProps {
    name: string;
    structureName: string;
    key?: string | number;
    structureType: StructureType;
    label?: string;
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
}

export interface InputFileFieldProps {
    name: string;
    fileButtonProps?: Omit<FileButtonProps, 'onChange' | 'children'>;
    buttonProps?: ButtonProps;
    onCleared?: () => void;
    clear?: boolean;
    buttonText?: string;
    showFileName?: boolean;
    validation?: {
        allowedSize?: {
            size: number;
            message?: string;
        };
        allowedDimensions?: {
            width: number;
            height: number;
            message?: string;
        };
        required?: {
            value: boolean;
            message?: string;
        };
        maxFiles?: number;
    };
    onUploaded?: (attachments: Attachment[]) => void;
}

export interface InputLocaleFieldProps {
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
}

export interface InputGroupsFieldProps {
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
}

interface Props<T extends FieldValues> {
    useSpecialFields: UseBoundStore<StoreApi<SpecialFieldsStore>>;
    structureType: string;
    formProps?: UseFormProps<T>;
    isUpdate: boolean;
    connectionStore: UseBoundStore<StoreApi<ConnectionStore>>;
    imagePathsStore: UseBoundStore<StoreApi<ImagePathsStoreData>>;
    globalLoadingStore: GlobalLoadingStore;
    inputs: (
        submitButton: React.ReactNode,
        actions: {
            setValue: UseFormSetValue<T>;
            getValues: UseFormGetValues<T>;
            setFocus: UseFormSetFocus<T>;
            setError: UseFormSetError<T>;
            reset: UseFormReset<T>;
            resetField: UseFormResetField<T>;
            register: UseFormRegister<T>;
            unregister: UseFormUnregister<T>;
            watch: UseFormWatch<T>;
            trigger: UseFormTrigger<T>;
            getFieldState: UseFormGetFieldState<T>;
            formState: UseFormStateReturn<T>;
            defaultValues: T;
            inputFile: (props: InputFileFieldProps) => React.ReactNode;
            inputLocale: (props?: InputLocaleFieldProps) => React.ReactNode;
            inputGroups: (props?: InputGroupsFieldProps) => React.ReactNode;
            inputBehaviour: () => React.ReactNode;
            inputConnection: (props: InputConnectionFieldProps) => React.ReactNode;
        },
    ) => React.ReactNode;
    onSubmit: (value: T, e: BaseSyntheticEvent | undefined) => void;
    isSaving: boolean;
    currentData: GetVariableResponse | QueriedListItem | QueriedMapItem | undefined;
}
export default function BaseForm<T extends FieldValues>({
    formProps,
    connectionStore,
    imagePathsStore,
    useSpecialFields,
    inputs,
    globalLoadingStore,
    isUpdate,
    onSubmit,
    isSaving,
    currentData,
}: Props<T>) {
    const setLocale = useSpecialFields((state) => state.setLocale);
    const setGroups = useSpecialFields((state) => state.setGroups);
    const setBehaviour = useSpecialFields((state) => state.setBehaviour);
    formProps = formProps || {};

    if (isUpdate && currentData) {
        setLocale(currentData.locale);
        setGroups(currentData.groups || []);
        setBehaviour(currentData.behaviour);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        formProps.defaultValues = currentData.value;
    } else {
        setLocale(Runtime.instance.currentLocaleStorage.getLocale());
        setGroups([]);
    }
    const methods = useForm(formProps);

    const {
        setValue,
        getValues,
        setError,
        setFocus,
        reset,
        resetField,
        register,
        unregister,
        watch,
        trigger,
        getFieldState,
        formState,
    } = methods;

    const isLoading = formState.isLoading;

    const inputFile = useCallback(
        (props: InputFileFieldProps) => (
            <FileUploadButton globalLoadingStore={globalLoadingStore} store={imagePathsStore} {...props} />
        ),
        [],
    );

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                {!isLoading &&
                    inputs(
                        <SubmitButton
                            isSaving={isSaving}
                            isUpdate={isUpdate}
                            globalLoadingStore={globalLoadingStore}
                        />,
                        {
                            setValue: setValue,
                            getValues: getValues,
                            setFocus: setFocus,
                            setError: setError,
                            reset: reset,
                            register: register,
                            resetField: resetField,
                            unregister: unregister,
                            watch: watch,
                            trigger: trigger,
                            formState: formState,
                            getFieldState: getFieldState,
                            defaultValues: getValues(),
                            inputFile: inputFile,
                            inputLocale: (props?: InputLocaleFieldProps) => (
                                <InputLocale {...props} store={useSpecialFields} />
                            ),
                            inputGroups: (props?: InputGroupsFieldProps) => (
                                <InputGroups store={useSpecialFields} {...props} />
                            ),
                            inputBehaviour: () => <InputBehaviour store={useSpecialFields} />,
                            inputConnection: (props: InputConnectionFieldProps) => (
                                <InputConnection {...props} name={props.name} store={connectionStore} />
                            ),
                        },
                    )}
            </form>
        </FormProvider>
    );
}
