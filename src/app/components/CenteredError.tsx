import { Alert } from '@mantine/core';
import styles from './css/CenteredError.module.css';
import type { PropsWithChildren } from 'react';
interface Props {
    title: string;
    flexCentered?: boolean;
}
export default function CenteredError({ title, children }: Props & PropsWithChildren) {
    return (
        <Alert className={styles.centered} variant="light" color="red" title={title}>
            {children}
        </Alert>
    );
}
