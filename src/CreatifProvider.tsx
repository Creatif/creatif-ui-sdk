import Authentication from '@app/components/authentication/Authentication';
import { Initialize } from '@app/initialize';
import authCheck from '@lib/api/auth/authCheck';
import { getProjectMetadata } from '@lib/api/project/getProjectMetadata';
import {getSupportedLocales} from '@lib/api/project/getSupportedLocales';
import CurrentLocaleStorage from '@lib/storage/currentLocaleStorage';
import StructureStorage from '@lib/storage/structureStorage';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import React, { useCallback, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import type { PropsWithChildren } from 'react';
import 'normalize.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@app/css/reset.module.css';
import styles from '@app/css/global.module.css';

interface Props {
  apiKey: string;
  projectId: string;
}

const theme = createTheme({
	fontFamily: 'Barlow, sans-serif',
	fontFamilyMonospace: 'Monaco, Courier, monospace',
	headings: { fontFamily: 'Barlow, sans-serif' },
});

const queryClient = new QueryClient();
export function CreatifProvider({
	apiKey,
	projectId,
	children,
}: Props & PropsWithChildren) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [checkedAuth, setIsAuthCheck] = useState<'idle' | 'success' | 'fail'>(
		'idle',
	);

	const init = useCallback(async () => {
		const { result } = await getProjectMetadata();

		if (result) {
			getSupportedLocales().then(({result: locales, error}) => {
				if (error) {
					queryClient.setQueryData('supported_locales', 'failed');
				}

				if (locales) {
					queryClient.setQueryData('supported_locales', locales);
				}

				CurrentLocaleStorage.init('eng');
				Initialize.init(apiKey, projectId, CurrentLocaleStorage.instance.getLocale());
				StructureStorage.init(result);
				setIsLoggedIn(true);
			});
		}
	}, []);

	useEffect(() => {
		authCheck().then(async (res) => {
			if (res.error) {
				setIsAuthCheck('fail');
				return;
			}

			init();
		});
	}, []);

	return (
		<MantineProvider theme={theme}>
			{isLoggedIn && <Notifications limit={5} />}
			{isLoggedIn && (
				<>
					<QueryClientProvider client={queryClient}>
						<div className={styles.initialAnimation}>{children}</div>
					</QueryClientProvider>
				</>
			)}

			{!isLoggedIn && checkedAuth === 'fail' && (
				<Authentication
					apiKey={apiKey}
					projectId={projectId}
					onSuccess={init}
				/>
			)}
		</MantineProvider>
	);
}
