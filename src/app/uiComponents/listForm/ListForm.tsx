import { Initialize } from '@app/initialize';
import useNotification from '@app/systems/notifications/useNotification';
import {appendToList} from '@lib/api/declarations/lists/appendToList';
import { createList } from '@lib/api/declarations/lists/createList';
import Storage from '@lib/storage/storage';
import {Button, Group} from '@mantine/core';
import React, {useEffect, useState} from 'react';
import {Simulate} from 'react-dom/test-utils';
import { FormProvider, useForm} from 'react-hook-form';
import type { HTMLAttributes ,BaseSyntheticEvent} from 'react';
import type {DefaultValues, FieldValues, SubmitHandler} from 'react-hook-form';
interface Props<T extends FieldValues> {
  listName: string;
  bindings: {name: string, groups?: string}
  defaultValues: DefaultValues<T>;
  inputs: (submitButton: React.ReactNode) => React.ReactNode;
  onSubmit?: SubmitHandler<T>;
  locale?: string;
  form?: HTMLAttributes<HTMLFormElement>;
}


export default function ListForm<T extends FieldValues>({
	listName,
	locale,
	defaultValues,
	bindings,
	inputs,
	onSubmit,
}: Props<T>) {
	const methods = useForm<T>({
		defaultValues: defaultValues,
	});
	const [isSaving, setIsSaving] = useState(false);
	const {error: notificationError, warn, info, success} = useNotification();

	useEffect(() => {
		const chosenLocale = locale ? locale : Initialize.Locale();
		if (!Storage.instance.hasList(listName, chosenLocale)) {
			createList({
				name: listName,
				locale: chosenLocale,
			}).then(({ result, error }) => {
				if (error && error.error?.data && error.error.data['nameExists']) {
					Storage.instance.addList(listName, chosenLocale);
					warn('An error occurred.', <span>List with name <strong>{listName}</strong> already exists. If locale storage was the deleted before this action, this warning will show only once.</span>);
					return;
				}

				if (error) {
					notificationError('Something wrong happened.', 'We are working to resolve this problem. Please, try again later.');
					return;
				}

				if (result) {
					Storage.instance.addList(listName, chosenLocale);
					info('List created', <span>List <strong>{listName}</strong> has been successfully created. This message will only appear once.</span>);
				}
			});
		}
	}, []);

	return <FormProvider {...methods}>
		<form onSubmit={methods.handleSubmit((value: T, e: BaseSyntheticEvent | undefined) => {
			if (!value) {
				notificationError('No data submitted.', <span><strong>undefined</strong> has been submitted which means there are no values to save. Have you added some fields to your form?</span>);
				return;
			}

			const name: string = value[bindings.name];
			let groups: string[] = [];
			if (!name) {
				notificationError('Name binding does not exist.', <span>You haven't provided any binding for the name of the variable. Add the <i>bindings</i> property to your form.</span>);
				return;
			}

			if (bindings.groups) {
				if (!value[bindings.groups]) {
					notificationError('Wrong groups binding.', <span>You provided a binding for groups <strong>{bindings.groups}</strong> but there is not form field with that name. Add a form field with the same name as <i>{bindings.groups}</i></span>);
					return;
				}

				const g = value[bindings.groups] as string[] | string;
				if (typeof g === 'string') {
					groups.push(g);
				} else if (Array.isArray(g)) {
					groups = [...groups, ...g];
				}
			}

			setIsSaving(true);
			appendToList({
				name: listName,
				variables: [{
					name: name,
					behaviour: 'modifiable',
					groups: groups,
					value: value,
				}]
			}).then(({result, error}) => {
				if (error) {
					notificationError('An error occurred.', <span>List variable with name <strong>{name}</strong> could not be created. See the development bar for more details.</span>);
				}

				if (result) {
					onSubmit?.(value, e);
					success('List variable created', <span>List variable <strong>{name}</strong> has been created.</span>);
				}

				setIsSaving(false);
			});
		})}>
			{inputs(
				<Group justify="end">
					<Button loaderProps={{type: 'dots'}} loading={isSaving} type="submit">{isSaving ? 'Creating' : 'Create'}</Button>
				</Group>
			)}
		</form>
	</FormProvider>;
}
