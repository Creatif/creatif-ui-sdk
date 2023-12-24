import classNames from 'classnames';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shared/css/AppPill.module.css';
import React from 'react';

interface Props<T> {
    onChange: (item: T) => void;
    value: T;
    icon: React.ReactNode;
    text: string;
    selected: boolean;
}

export default function AppPill<T>({ onChange, icon, text, value, selected }: Props<T>) {
    return (
        <div
            onClick={() => {
                onChange(value);
            }}
            className={classNames(styles.root, selected ? styles.selected : undefined)}>
            {icon}
            <span>{text}</span>
        </div>
    );
}
