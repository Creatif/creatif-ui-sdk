import { Alert } from '@mantine/core';
import type { PropsWithChildren } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
interface Props {
    title: string;
}
export default function UIError({ title, children }: Props & PropsWithChildren) {
    return (
        <Alert color="red" variant="light" title={title} icon={<IconAlertTriangle size={20} />}>
            {children}
        </Alert>
    );
}
