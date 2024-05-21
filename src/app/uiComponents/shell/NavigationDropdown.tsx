// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shell/css/navigation.module.css';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

export interface Props {
    topItem: {
        icon?: React.ReactNode;
        text: React.ReactNode;
    };
    dropdownItems: {
        icon?: React.ReactNode;
        text: React.ReactNode;
        to: string;
    }[];
}

export function NavigationDropdown({ topItem, dropdownItems }: Props) {
    const isActive = location.pathname.includes('/structures/maps') || location.pathname.includes('/structures/lists');
    const [isToggleMenu, setIsToggleMenu] = useState(false);

    useEffect(() => {
        setIsToggleMenu(isActive);
    }, [isActive]);

    return (
        <ul
            className={classNames(
                styles.appMenuDropdown,
                isToggleMenu ? styles.appMenuDropdownOpen : styles.appMenuDropdownClose,
            )}>
            <li>
                <button
                    onClick={() => setIsToggleMenu(!isToggleMenu)}
                    className={classNames(styles.appMenuButton, styles.appMenuDropdownButton)}>
                    {topItem.icon ? topItem.icon : undefined}
                    {topItem.text}
                </button>

                <ul>
                    {dropdownItems.map((item, i) => {
                        return (
                            <li key={i}>
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) => {
                                        if (isActive)
                                            return classNames(
                                                styles.appMenuButton,
                                                styles.appMenuDropdownButton,
                                                styles.active,
                                            );

                                        return classNames(styles.appMenuButton, styles.appMenuDropdownButton);
                                    }}>
                                    {item.icon ? item.icon : undefined}
                                    {item.text}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </li>
        </ul>
    );
}
