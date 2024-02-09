import type { MantineStyleProp } from '@mantine/core';
import { Alert } from '@mantine/core';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
interface Props {
    title: string;
    dissmisable?: boolean;
    onClose?: () => void;
    style?: MantineStyleProp;
}
export default function UIError({ title, dissmisable, style, onClose, children }: Props & PropsWithChildren) {
    const [isClosed, setIsClosed] = useState(false);
    return (
        <>
            {!isClosed && (
                <Alert
                    withCloseButton={dissmisable}
                    closeButtonLabel="Dismiss"
                    onClose={() => {
                        if (dissmisable && !isClosed) {
                            setIsClosed(true);
                            onClose?.();
                        }
                    }}
                    style={style}
                    color="red"
                    variant="light"
                    title={title}
                    icon={<IconAlertTriangle size={20} />}>
                    {children}
                </Alert>
            )}
        </>
    );
}
