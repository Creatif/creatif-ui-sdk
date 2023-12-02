import styles from '@app/uiComponents/appShells/singleColumn/css/navigation.module.css';
import React from 'react';
interface Props {
  logo?: React.ReactNode;
  navItems: {
    text: React.ReactNode;
    navigateTo?: string;
    icon?: React.ReactNode;
  }[];
}
export default function Navigation({ navItems, logo }: Props) {
	return (
		<div className={styles.navigationGrid}>
			{logo && <div className={styles.logo}>{logo}</div>}

			<nav className={styles.root}>
				{navItems.map((item, index) => (
					<a key={index} className={styles.navItem} href={item.navigateTo}>
						{item.icon && (
							<span className={styles.navItemIcon}>{item.icon}</span>
						)}
						<span className={styles.navItemText}>{item.text}</span>
					</a>
				))}
			</nav>
		</div>
	);
}
