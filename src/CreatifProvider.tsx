import Authentication from '@app/components/authentication/Authentication';
import {Initialize} from '@app/initialize';
import authCheck from '@lib/api/auth/authCheck';
import Storage from '@lib/storage/storage';
import { PrimeReactProvider } from 'primereact/api';
import React, {useCallback, useEffect, useState} from 'react';
import type { APIOptions } from 'primereact/api';
import type { PropsWithChildren } from 'react';
import 'normalize.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import '@app/css/global.module.css';
import {Notification} from '@app/components/Alert';
interface Props {
  primeReactProps?: Partial<APIOptions>;
  apiKey: string;
  projectId: string;
  locale?: string;
}
export function CreatifProvider({
	primeReactProps,
	apiKey,
	projectId,
	locale = 'eng',
	children,
}: Props & PropsWithChildren) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [checkedAuth, setIsAuthCheck] = useState<'idle' | 'success' | 'fail'>('idle');

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
		<PrimeReactProvider value={primeReactProps}>
			{isLoggedIn && <>
				{children}

				<Notification />
			</>}

			{!isLoggedIn && checkedAuth === 'fail' && <Authentication apiKey={apiKey} projectId={projectId} onSuccess={() => {
				init();
				setIsLoggedIn(true);
			}} />}
		</PrimeReactProvider>
	);
}
