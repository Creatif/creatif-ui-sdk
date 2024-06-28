// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from '@app/layouts/css/grid.module.css';
import type { HTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';

interface Props extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {
    cls?: string[];
    gap?: string;
}

export function Grid({ cls = [], gap = '8px', children, ...rest }: Props) {
    return (
        <div
            className={classNames(css.root, ...cls)}
            {...rest}
            style={{
                gap: gap,
            }}>
            {children}
        </div>
    );
}
