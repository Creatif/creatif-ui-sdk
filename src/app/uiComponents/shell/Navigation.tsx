// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shell/css/navigation.module.css';
import classNames from 'classnames';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import type { AppShellItem } from '@root/types/shell/shell';
import StructureStorage from '@lib/storage/structureStorage';
import { Badge, Tooltip } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import logout from '@lib/api/auth/logout';
import NavigationIcon from '@app/uiComponents/shell/NavigationIcon';
import { getEnvironmentStore } from '@app/systems/stores/environmentStore';
interface Props {
    logo?: React.ReactNode;
    navItems: AppShellItem[];
}
export default function Navigation({ navItems, logo }: Props) {
    const projectName = StructureStorage.instance.projectName();
    const useEnvironment = getEnvironmentStore();
    const currentEnv = useEnvironment((state) => state.environment);

    const envBadge = currentEnv === 'dev' ? <Badge color="orange">DEV</Badge> : <Badge color="green">PROD</Badge>;
    const envTooltip =
        currentEnv === 'dev'
            ? 'When in DEV mode, data is not persisted on the cloud but saved locally.'
            : 'When in PROD mode, data is persisted in the cloud.';
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
                    <Tooltip label={envTooltip}>{envBadge}</Tooltip>
                </div>
            </div>

            <nav className={styles.root}>
                {navItems.map((item, index) => (
                    <NavLink
                        key={index}
                        className={({ isActive }) => {
                            if (isActive) return classNames(styles.navItem, styles.active);

                            return styles.navItem;
                        }}
                        to={item.routePath}>
                        {!item.menuIcon && <NavigationIcon type={item.structureType} />}
                        {item.menuIcon && <span className={styles.navItemIcon}>{item.menuIcon}</span>}
                        <span className={styles.navItemText}>{item.menuText}</span>
                    </NavLink>
                ))}
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
