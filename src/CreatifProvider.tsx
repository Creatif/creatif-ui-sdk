import { PrimeReactProvider } from 'primereact/api';
import React, {useState} from 'react';
import type { APIOptions } from 'primereact/api';
import type { PropsWithChildren } from 'react';
import 'normalize.css';
import Authentication from '@app/components/authentication/Authentication';
import 'primereact/resources/themes/lara-light-blue/theme.css';
interface Props {
  primeReactProps?: Partial<APIOptions>;
  apiKey: string;
  projectId: string;
}
export function CreatifProvider({
	primeReactProps,
	apiKey,
	projectId,
	children,
}: Props & PropsWithChildren) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	return (
		<PrimeReactProvider value={primeReactProps}>
			{isLoggedIn && <>{children}</>}

			{!isLoggedIn && <Authentication apiKey={apiKey} projectId={projectId} />}
		</PrimeReactProvider>
	);
}
