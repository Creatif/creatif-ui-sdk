// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shell/css/navigation.module.css';
import classNames from 'classnames';
import React, { useState } from 'react';

export interface Props {
    topItem: {
        icon?: React.ReactNode;
        text: React.ReactNode;
    },
    dropdownItems: {
        icon?: React.ReactNode;
        text: React.ReactNode;
    }[];
}

export function NavigationDropdown({topItem, dropdownItems}: Props) {
    const [isToggleMenu, setIsToggleMenu] = useState(false);

   return  <ul className={classNames(styles.appMenuDropdown, isToggleMenu ? styles.appMenuDropdownOpen : styles.appMenuDropdownClose)}>
        <li>
            <button onClick={() => setIsToggleMenu(!isToggleMenu)} className={classNames(styles.appMenuButton, styles.appMenuDropdownButton)}>
                {topItem.icon ? topItem.icon : undefined}
                {topItem.text}
            </button>

            <ul>
                {dropdownItems.map((item, i) => {
                    return <li key={i}>
                        <button className={classNames(styles.appMenuButton, styles.appMenuDropdownButton)}>
                            {item.icon ? item.icon : undefined}
                            {item.text}
                        </button>
                    </li>;
                })}
            </ul>
        </li>
    </ul>;
}