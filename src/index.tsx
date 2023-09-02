import {UiProvider} from '@app/UiProvider';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

const rootElement = document.getElementById('root');
if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<React.StrictMode>
			<UiProvider>
				<p>Works</p>
			</UiProvider>
		</React.StrictMode>,
	);
}