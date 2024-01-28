// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shell/css/navigation.module.css';
import classNames from 'classnames';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import type { AppShellItem } from '@root/types/shell/shell';
import StructureStorage from '@lib/storage/structureStorage';
import { Tooltip } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import logout from '@lib/api/auth/logout';
import NavigationIcon from '@app/uiComponents/shell/NavigationIcon';
import { getOptions } from '@app/systems/stores/options';
interface Props {
    logo?: React.ReactNode;
    navItems: AppShellItem[];
}
export default function Navigation({ navItems, logo }: Props) {
    const projectName = StructureStorage.instance.projectName();

    return (
        <div className={styles.navigationGrid}>
            {logo && <div className={styles.logo}>{logo}</div>}

            <div className={styles.project}>
                <Link to="/" className={styles.projectLogo}>
                    {StructureStorage.instance.projectName().substring(0, 2).toUpperCase()}
                </Link>

                <div className={styles.projectEnvWithName}>
                    {projectName.length > 10 && (
                        <Tooltip label={projectName}>
                            <p className={styles.projectName}>{`${projectName.substring(0, 10)}...`}</p>
                        </Tooltip>
                    )}

                    {projectName.length < 10 && <p className={styles.projectName}>{projectName}</p>}
                </div>
            </div>

            <nav className={styles.root}>
                {navItems.map((item, index) => {
                    const { store } = getOptions(item.structureName, item.structureType);

                    return (
                        <React.Fragment key={index}>
                            {store && (
                                <NavLink
                                    className={({ isActive }) => {
                                        if (isActive) return classNames(styles.navItem, styles.active);

                                        return styles.navItem;
                                    }}
                                    to={store.getState().paths.listing}>
                                    {!item.menuIcon && <NavigationIcon type={item.structureType} />}
                                    {item.menuIcon && <span className={styles.navItemIcon}>{item.menuIcon}</span>}
                                    <span className={styles.navItemText}>
                                        {item.menuText ? item.menuText : item.structureName}
                                    </span>
                                </NavLink>
                            )}
                        </React.Fragment>
                    );
                })}
            </nav>

            <nav className={styles.appMenu}>
                <button
                    onClick={async () => {
                        await logout();
                        location.href = '/';
                    }}
                    className={styles.appMenuButton}>
                    <IconLogout
                        color="var(--mantine-color-gray-7)"
                        style={{
                            alignSelf: 'flex-start',
                        }}
                        size={20}
                    />
                    Logout
                </button>
            </nav>
        </div>
    );
}
