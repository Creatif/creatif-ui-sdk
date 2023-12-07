import Loading from '@app/components/Loading';
import { Initialize } from '@app/initialize';
import useNotification from '@app/systems/notifications/useNotification';
import { getOptions } from '@app/systems/stores/options';
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import { appendToList } from '@lib/api/declarations/lists/appendToList';
import { declarations } from '@lib/http/axios';
import useHttpMutation from '@lib/http/useHttpMutation';
import Storage from '@lib/storage/storage';
import { Button, Group } from '@mantine/core';
import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import type { AppendedListResult } from '@lib/api/declarations/types/listTypes';
import type { Behaviour } from '@lib/api/declarations/types/sharedTypes';
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

type Bindings<T> = {
  name: NameBinding<T>;
  groups?: GroupBinding<T>;
  behaviour?: BehaviourBinding<T>;
};
type NameBinding<T> = string | ((values: T) => string);
type BehaviourBinding<T> = string | ((values: T) => Behaviour);
type GroupBinding<T> = string | ((values: T) => string | string[]);
interface Props<T extends FieldValues> {
  listName: string;
  bindings: Bindings<T>;
  formProps: UseFormProps<T>;
  update: {
	  getFn: <F = unknown>() => F;
	  transformFn: <F = unknown>(value: F) => T;
  }
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
  beforeSave?: (values: T, e: BaseSyntheticEvent | undefined) => any;
  afterSave?: (
    result: AppendedListResult,
    e: BaseSyntheticEvent | undefined,
  ) => void;
  locale?: string;
  form?: HTMLAttributes<HTMLFormElement>;
}
function resolveBindings<T extends FieldValues>(
	values: T,
	bindings: Bindings<T>,
	t: keyof Bindings<T>,
) {
	if (!bindings[t]) return false;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	if (typeof bindings[t] === 'string' && !values[bindings[t]]) return false;

	let name = '';
	if (typeof bindings[t] === 'string') {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return values[bindings[t]];
	}

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	name = bindings[t](values);
	if (!name) return false;

	return name;
}
export default function ListForm<T extends FieldValues>({
	listName,
	locale,
	formProps,
	bindings,
	inputs,
	beforeSave,
	afterSave,
}: Props<T>) {
	const methods = useForm(formProps);

	const { success: successNotification, error: errorNotification } =
    useNotification();

	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const useStructureOptionsStore = getOptions(listName);
	const [isSaving, setIsSaving] = useState(false);
	const { error: notificationError, success } = useNotification();
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

			const name = resolveBindings<T>(value, bindings, 'name');
			if (!name) {
				notificationError(
					'Name binding does not exist.',
					<span>
            You haven't provided any binding for the name of the variable. Add
            the <i>bindings</i> property to your form.
					</span>,
				);
				return;
			}

			const g = resolveBindings(value, bindings, 'groups');
			if (bindings.groups && !g) {
				notificationError(
					'Cannot determine groups binding',
					'Groups binding cannot be determined. If a field name is provided, be sure that it exists as a field in your form. If a function is provided, be sure to return either a string or Array<string>',
				);
				return;
			}

			let groups: string[] = [];
			if (typeof g === 'string') {
				groups.push(g);
			} else if (Array.isArray(g)) {
				groups = [...groups, ...g];
			}

			const b = resolveBindings(value, bindings, 'behaviour');
			if (bindings.behaviour && !b) {
				notificationError(
					'Cannot determine behaviour binding',
					'Behaviour binding cannot be determined. If a field name is provided, be sure that it exists as a field in your form. If a function is provided, be sure to return either a string',
				);
				return;
			}

			let behaviour: Behaviour = 'modifiable';
			if (b) {
				behaviour = b;
			}

			setIsSaving(true);

			Promise.resolve(beforeSave?.(value, e)).then((result) => {
				appendToList({
					name: listName,
					variables: [
						{
							name: name,
							behaviour: behaviour,
							groups: groups,
							value: result,
						},
					],
				}).then(({ result, error }) => {
					if (error) {
						notificationError(
							'An error occurred.',
							<span>
                List variable with name <strong>{name}</strong> could not be
                created. See the development bar for more details.
							</span>,
						);
					}

					if (result) {
						afterSave?.(result, e);
						success(
							`Variable for structure ${listName}`,
							<span>
                List variable <strong>{name}</strong> has been created.
							</span>,
						);
					}

					queryClient.invalidateQueries(listName);
					setIsSaving(false);
					navigate(useStructureOptionsStore.getState().paths.listing);
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
            			{isSaving ? 'Creating' : 'Create'}
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
