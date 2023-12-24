// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shell/css/navigation.module.css';
import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';
import type { AppShellItem } from '@root/types/shell/shell';
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
                    <NavLink
                        key={index}
                        className={({ isActive }) => {
                            if (isActive) return classNames(styles.navItem, styles.active);

                            return styles.navItem;
                        }}
                        to={item.routePath}>
                        {item.menuIcon && <span className={styles.navItemIcon}>{item.menuIcon}</span>}
                        <span className={styles.navItemText}>{item.menuText}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}
