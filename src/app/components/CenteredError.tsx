import { Alert } from '@mantine/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/components/css/CenteredError.module.css';
import type { PropsWithChildren } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';

interface Props {
    title: string;
    flexCentered?: boolean;
}

export default function CenteredError({ title, children }: Props & PropsWithChildren) {
    return (
        <Alert
            className={styles.centered}
            variant="light"
            color="red"
            title={title}
            icon={<IconAlertTriangle size={20} />}>
            {children}
        </Alert>
    );
}
