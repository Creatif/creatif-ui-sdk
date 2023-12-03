import styles from '@app/uiComponents/appShells/singleColumn/css/navigation.module.css';
import React from 'react';
import { Link } from 'react-router-dom';
import type { AppShellItem } from '@app/uiComponents/appShells/types/AppShellItems';
interface Props {
  logo?: React.ReactNode;
  navItems: AppShellItem[];
}
export default function Navigation({ navItems, logo }: Props) {
	return (
		<div className={styles.navigationGrid}>
			{logo && <div className={styles.logo}>{logo}</div>}

			<nav className={styles.root}>
				{navItems.map((item, index) => (
					<Link key={index} className={styles.navItem} to={item.menu.path}>
						{item.menu.icon && (
							<span className={styles.navItemIcon}>{item.menu.icon}</span>
						)}
						<span className={styles.navItemText}>{item.menu.text}</span>
					</Link>
				))}
			</nav>
		</div>
	);
}
