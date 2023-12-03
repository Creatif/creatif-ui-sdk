import RouterComponent from '@app/components/RouterComponent';
import {createOptions} from '@app/systems/stores/options';
import Navigation from '@app/uiComponents/appShells/singleColumn/Navigation';
import UnstructuredList from '@app/uiComponents/listing/UnstructuredList';
import {Container} from '@mantine/core';
import React, {useEffect, useRef} from 'react';
import {BrowserRouter, Outlet, Route, Routes} from 'react-router-dom';
import styles from './css/root.module.css';
import type {AppShellItems} from '@app/uiComponents/appShells/types/AppShellItems';
interface Props {
  options: AppShellItems;
}
export default function SingleColumn({
	options,
}: Props) {
	const storeCreatedRef = useRef(false);
	if (!storeCreatedRef.current) {
		for (const option of options.items) {
			const {name, type} = option.create.structure;
			const {path} = option.menu;

			createOptions({
				structureName: name,
				path: path,
				type: type,
			});
		}

		storeCreatedRef.current = true;
	}

	return (
		<Container fluid m={0} p={0}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<div className={styles.root}>
						{options && <Navigation navItems={options.items} logo={options.logo} />}

						<div>
							{options.header && <header className={styles.header}>{options.header}</header>}

							<div className={styles.content}>{<Outlet />}</div>
						</div>
					</div>}>

						{options.items.map((item, i) => <React.Fragment key={i}>
							<Route path={`${item.menu.path}/create`} element={<RouterComponent Component={item.create.Component} structureName={item.create.structure.name} />} />
							{item.create.structure.type === 'list' && <Route path={`${item.menu.path}`} element={<UnstructuredList listName={item.create.structure.name} />} />}
						</React.Fragment>)}

					</Route>
				</Routes>
			</BrowserRouter>
		</Container>
	);
}
