import { createOptions } from '@app/systems/stores/options';
import Header from '@app/uiComponents/appShells/singleColumn/Header';
import Navigation from '@app/uiComponents/appShells/singleColumn/Navigation';
import UnstructuredList from '@app/uiComponents/listing/list/UnstructuredList';
import { Container } from '@mantine/core';
import React, { useRef } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import styles from './css/root.module.css';
import type { AppShellItems } from '@app/uiComponents/appShells/types/AppShellItems';
interface Props {
    options: AppShellItems;
}
export default function SingleColumn({ options }: Props) {
	const storeCreatedRef = useRef(false);
	if (!storeCreatedRef.current) {
		for (const option of options.items) {
			const { name, type } = option.structure;
			const { path } = option.menu;

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
					<Route
						path="/"
						element={
							<div className={styles.root}>
								{options && <Navigation navItems={options.items} logo={options.logo} />}

								<div>
									{options.header && <Header>{options.header}</Header>}

									<div className={styles.content}>{<Outlet />}</div>
								</div>
							</div>
						}>
						{options.items.map((item, i) => (
							<React.Fragment key={i}>
								<Route path={`${item.menu.path}/create`} element={item.create.component} />
								<Route
									path={`${item.menu.path}/update/:structureId/:itemId`}
									element={item.update.component}
								/>
								{item.structure.type === 'list' && (
									<Route
										path={`${item.menu.path}`}
										element={<UnstructuredList listName={item.structure.name} />}
									/>
								)}
							</React.Fragment>
						))}
					</Route>
				</Routes>
			</BrowserRouter>
		</Container>
	);
}
