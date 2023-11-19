import {useToast} from '@app/components/Alert';
import {Initialize} from '@app/initialize';
import {createList} from '@lib/api/declarations/lists/createList';
import Storage from '@lib/storage/storage';
import {InputText} from 'primereact/inputtext';
import {useEffect} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import type {HTMLAttributes} from 'react';
interface Props {
    listName: string;
    defaultValues: Record<string, any>;
	locale?: string;
    form?: HTMLAttributes<HTMLFormElement>;
}
export default function ListForm({listName, locale, defaultValues}: Props) {
	const methods = useForm({
		defaultValues: defaultValues,
	});

	const notification = useToast((state) => state.show);

	useEffect(() => {
		const chosenLocale = locale ? locale : Initialize.Locale();
		if (!Storage.instance.hasList(listName, chosenLocale)) {
			createList({
				name: listName,
				locale: chosenLocale,
			}).then(({result, error}) => {
				if (error) {
					notification({
						severity: 'error',
						summary: <span>Cannot create list <strong>listName</strong></span>,
						detail: 'Please, try again later.',
						life: 5000,
					});

					return;
				}

				if (result) {
					Storage.instance.addList(listName, chosenLocale);
					notification({
						severity: 'info',
						summary:  <span><strong>listName</strong> has been successfully created.</span>,
						detail: 'This list will be created only once.',
					});
				}
			});
		}
	}, []);

	return <FormProvider {...methods}>
		<InputText />
	</FormProvider>;
}