// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shell/css/navigation.module.css';
import classNames from 'classnames';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import type { AppShellItem } from '@root/types/shell/shell';
import { Tooltip } from '@mantine/core';
import { IconApiApp, IconChevronRight, IconLogout, IconStack3, IconTopologyBus } from '@tabler/icons-react';
import logout from '@lib/api/auth/logout';
import NavigationIcon from '@app/uiComponents/shell/NavigationIcon';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import { NavigationDropdown } from '@app/uiComponents/shell/NavigationDropdown';
import { Runtime } from '@app/systems/runtime/Runtime';

interface Props {
    logo?: React.ReactNode;
    navItems: AppShellItem[];
}

export default function Navigation({ navItems, logo }: Props) {
    const projectName = Runtime.instance.currentProjectCache.getProject().name;
    const useMetadataStore = getProjectMetadataStore();
    const structures = useMetadataStore((state) => state.structureItems);

    return (
        <div className={styles.navigationGrid}>
            {logo && <div className={styles.logo}>{logo}</div>}

            <div className={styles.project}>
                <Link to={Runtime.instance.rootPath()} className={styles.projectLogo}>
                    {projectName.substring(0, 2).toUpperCase()}
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
                {structures.map((item, index) => {
                    const navItem = navItems.find(
                        (t) => t.structureType === item.structureType && t.structureName === item.name,
                    );

                    return (
                        <React.Fragment key={index}>
                            {item && navItem && (
                                <NavLink
                                    className={({ isActive }) => {
                                        if (isActive) return classNames(styles.navItem, styles.active);

                                        return styles.navItem;
                                    }}
                                    to={`${item.navigationListPath}/${item.id}`}>
                                    {!navItem.menuIcon && <NavigationIcon type={item.structureType} />}
                                    {navItem.menuIcon && <span className={styles.navItemIcon}>{navItem.menuIcon}</span>}
                                    <span className={styles.navItemText}>
                                        {navItem.menuText ? navItem.menuText : navItem.structureName}
                                    </span>
                                </NavLink>
                            )}
                        </React.Fragment>
                    );
                })}
            </nav>

            <div className={styles.divider} />

            <nav className={styles.appMenu}>
                <NavLink
                    to="groups"
                    className={({ isActive }) => {
                        if (isActive) return classNames(styles.appMenuButton, styles.active);

                        return styles.appMenuButton;
                    }}>
                    <IconStack3
                        className="navItemIcon"
                        style={{
                            alignSelf: 'center',
                        }}
                        size={20}
                    />
                    Groups
                </NavLink>

                <NavLink
                    to="api"
                    className={({ isActive }) => {
                        if (isActive) return classNames(styles.appMenuButton, styles.active);

                        return styles.appMenuButton;
                    }}>
                    <IconApiApp
                        className="navItemIcon"
                        style={{
                            alignSelf: 'center',
                        }}
                        size={20}
                    />
                    API
                </NavLink>

                <NavigationDropdown
                    topItem={{
                        text: (
                            <span className={styles.appMenuInnerDecoration}>
                                Structures <IconChevronRight size={14} />
                            </span>
                        ),
                        icon: (
                            <IconTopologyBus
                                className="navItemIcon"
                                style={{
                                    alignSelf: 'center',
                                }}
                                size={20}
                            />
                        ),
                    }}
                    dropdownItems={[
                        {
                            text: 'Maps',
                            to: 'structures/maps',
                        },
                        {
                            text: 'Lists',
                            to: 'structures/lists',
                        },
                    ]}
                />

                <button
                    onClick={async () => {
                        await logout();
                        location.href = '/';
                    }}
                    className={styles.appMenuButton}>
                    <IconLogout
                        className={styles.logoutIcon}
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
