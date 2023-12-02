import Navigation from '@app/uiComponents/appShells/singleColumn/Navigation';
import React from 'react';
import styles from './css/root.module.css';
import type { PropsWithChildren } from 'react';
interface Props {
  header?: React.ReactNode;
  logo?: React.ReactNode;
  navItems: {
    text: React.ReactNode;
    navigateTo?: string;
    icon?: React.ReactNode;
  }[];
}
export default function SingleColumn({
	header,
	navItems,
	logo,
	children,
}: Props & PropsWithChildren) {
	return (
		<div className={styles.root}>
			{navItems && <Navigation navItems={navItems} logo={logo} />}

			<div>
				{header && <header className={styles.header}>{header}</header>}

				<div className={styles.content}>{children}</div>
			</div>
		</div>
	);
}
