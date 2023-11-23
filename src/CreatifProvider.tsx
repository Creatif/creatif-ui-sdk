import Authentication from '@app/components/authentication/Authentication';
import { Initialize } from '@app/initialize';
import authCheck from '@lib/api/auth/authCheck';
import Storage from '@lib/storage/storage';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import React, { useCallback, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import 'normalize.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

import '@app/css/reset.module.css';
import '@app/css/global.module.css';

interface Props {
  apiKey: string;
  projectId: string;
  locale?: string;
}

const theme = createTheme({
	/** Put your mantine theme override here */
});
export function CreatifProvider({
	apiKey,
	projectId,
	locale = 'eng',
	children,
}: Props & PropsWithChildren) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [checkedAuth, setIsAuthCheck] = useState<'idle' | 'success' | 'fail'>(
		'idle',
	);

	const init = useCallback(() => {
		Initialize.init(apiKey, projectId, locale);
		Storage.init();
	}, []);

	useEffect(() => {
		authCheck().then((res) => {
			if (res.error) {
				setIsAuthCheck('fail');
				return;
			}

			init();
			setIsLoggedIn(true);
		});
	}, []);

	return (
		<MantineProvider theme={theme}>
			{isLoggedIn && <Notifications />}
			{isLoggedIn && <>{children}</>}

			{!isLoggedIn && checkedAuth === 'fail' && (
				<Authentication
					apiKey={apiKey}
					projectId={projectId}
					onSuccess={() => {
						init();
						setIsLoggedIn(true);
					}}
				/>
			)}
		</MantineProvider>
	);
}
