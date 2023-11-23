import { Initialize } from '@app/initialize';
import useNotification from '@app/systems/notifications/useNotification';
import { createList } from '@lib/api/declarations/lists/createList';
import Storage from '@lib/storage/storage';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { HTMLAttributes, PropsWithChildren } from 'react';
interface Props {
  listName: string;
  defaultValues: Record<string, any>;
  locale?: string;
  form?: HTMLAttributes<HTMLFormElement>;
}
export default function ListForm({
	listName,
	locale,
	defaultValues,
	children,
}: Props & PropsWithChildren) {
	const methods = useForm({
		defaultValues: defaultValues,
	});

	const {error: notificationError, warn} = useNotification();

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
				}
			});
		}
	}, []);

	return <FormProvider {...methods}>{children}</FormProvider>;
}
