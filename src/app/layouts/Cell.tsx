// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from '@app/layouts/css/cell.module.css';
import type { HTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';

interface Props extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {
    span?: string;
    cls?: string[];
}

export function Cell({ span = 'span 4', cls = [], children }: Props) {
    return (
        <div
            className={classNames(css.root, ...cls)}
            style={{
                gridColumn: span,
            }}>
            {children}
        </div>
    );
}
