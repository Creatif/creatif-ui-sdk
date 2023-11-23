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
			<div className={styles.contentGrid}>
				{logo && <div className={styles.logo}>{logo}</div>}

				{navItems && (
					<nav>
						{navItems.map((item, index) => (
							<a key={index} className={styles.navItem} href={item.navigateTo}>
								{item.icon && (
									<span className={styles.navItemIcon}>{item.icon}</span>
								)}
								<span className={styles.navItemText}>{item.text}</span>
							</a>
						))}
					</nav>
				)}
			</div>

			<div>
				{header && <header className={styles.header}>{header}</header>}

				{children}
			</div>
		</div>
	);
}
