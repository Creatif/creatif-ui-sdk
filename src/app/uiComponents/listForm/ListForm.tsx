import Loading from '@app/components/Loading';
import { Initialize } from '@app/initialize';
import useNotification from '@app/systems/notifications/useNotification';
import { getOptions } from '@app/systems/stores/options';
import useUpdateList from '@app/systems/updateList/useUpdateList';
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import useAppendToList from '@app/uiComponents/listForm/helpers/useAppendToList';
import useResolveBindings from '@app/uiComponents/listForm/helpers/useResolveBindings';
import { declarations } from '@lib/http/axios';
import useHttpMutation from '@lib/http/useHttpMutation';
import Storage from '@lib/storage/storage';
import { Button, Group } from '@mantine/core';
import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import type {AfterSaveFn, BeforeSaveFn, Bindings} from '@app/uiComponents/types/forms';
import type { HTMLAttributes, BaseSyntheticEvent } from 'react';
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
interface Props<T extends FieldValues> {
  listName: string;
  bindings: Bindings<T>;
  formProps: UseFormProps<T>;
  mode?: 'update';
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
    },
  ) => React.ReactNode;
  beforeSave?: BeforeSaveFn<T>;
  afterSave?: AfterSaveFn;
  locale?: string;
  form?: HTMLAttributes<HTMLFormElement>;
}
export default function ListForm<T extends FieldValues>({
	listName,
	locale,
	formProps,
	bindings,
	inputs,
	beforeSave,
	afterSave,
	mode,
}: Props<T>) {
	const defaultListUpdate = useUpdateList<T>(Boolean(mode));
	if (mode === 'update' && defaultListUpdate) {
		formProps.defaultValues = defaultListUpdate;
	}

	const methods = useForm(formProps);
	const { success: successNotification, error: errorNotification } =
    useNotification();

	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const appendToList = useAppendToList(listName);
	const resolveBindings = useResolveBindings();
	const useStructureOptionsStore = getOptions(listName);
	const [isSaving, setIsSaving] = useState(false);
	const { error: notificationError } = useNotification();
	const { mutate } = useHttpMutation(
		declarations(),
		'put',
		`/list/${Initialize.ProjectID()}/${Initialize.Locale()}`,
		{
			onSuccess() {
				successNotification(
					`List with name ${listName} created.`,
					`List '${listName}' has been successfully created. This message will only appear once.`,
				);

				Storage.instance.addList(listName, locale ? locale : Initialize.Locale());
			},
			onError() {
				errorNotification(
					'Something wrong happened.',
					'We are working to resolve this problem. Please, try again later.',
				);
			},
		},
	);

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

	useEffect(() => {
		const chosenLocale = locale ? locale : Initialize.Locale();
		if (!Storage.instance.hasList(listName, chosenLocale)) {
			mutate({
				name: listName,
			});
		}
	}, []);

	const onInternalSubmit = useCallback(
		(value: T, e: BaseSyntheticEvent | undefined) => {
			if (!value) {
				notificationError(
					'No data submitted.',
					<span>
						<strong>undefined</strong> has been submitted which means there are
            no values to save. Have you added some fields to your form?
					</span>,
				);
				return;
			}

			const binding = resolveBindings(value, bindings);
			if (!binding) return;
			const {name, groups, behaviour} = binding;

			setIsSaving(true);

			Promise.resolve(beforeSave?.(value, e)).then((result) => {
				appendToList(name, behaviour, groups, result).then(isSuccess => {
					if (isSuccess) {
						queryClient.invalidateQueries(listName);
						afterSave?.(result, e);
						setIsSaving(false);
						navigate(useStructureOptionsStore.getState().paths.listing);
					}
				});
			});
		},
		[],
	);

	return (
		<div className={contentContainerStyles.root}>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onInternalSubmit)}>
					<Loading isLoading={isLoading} />
					{!isLoading &&
            inputs(
            	<Group justify="end">
            		<Button
            			loaderProps={{ size: 14 }}
            			loading={isSaving}
            			type="submit"
            		>
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
            	},
            )}
				</form>
			</FormProvider>
		</div>
	);
}
