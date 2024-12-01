import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconConfetti, IconExclamationCircle, IconInfoCircle } from '@tabler/icons-react';
import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import errStyles from './error.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import infoStyles from './info.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import successStyles from './success.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import warnStyles from './warn.module.css';
export default function useNotification() {
    return {
        warn: (title: string, description: React.ReactNode, autoClose: number | boolean = 7000, clean = false) => {
            notifications.show({
                withCloseButton: true,
                autoClose: autoClose,
                title: title,
                message: description,
                icon: <IconExclamationCircle color="white" />,
                color: 'orange',
                classNames: warnStyles,
            });

            if (clean) notifications.clean();
        },
        error: (title: string, description: React.ReactNode, autoClose: number | boolean = 7000, clean = false) => {
            notifications.show({
                withCloseButton: true,
                autoClose: autoClose,
                styles: (theme) => ({
                    title: { color: theme.white },
                    description: { color: theme.white },
                }),
                title: title,
                message: description,
                icon: <IconAlertTriangle color="white" />,
                classNames: errStyles,
            });

            if (clean) notifications.clean();
        },
        info: (title: string, description: React.ReactNode, autoClose: number | boolean = 3000, clean = false) => {
            notifications.show({
                withCloseButton: true,
                autoClose: autoClose,
                withBorder: true,
                title: title,
                message: description,
                icon: <IconInfoCircle color="gray" />,
                classNames: infoStyles,
            });

            if (clean) notifications.clean();
        },
        success: (title: string, description: React.ReactNode, autoClose: number | boolean = 3000, clean = false) => {
            notifications.show({
                withCloseButton: true,
                autoClose: autoClose,
                withBorder: true,
                title: title,
                message: description,
                icon: <IconConfetti color="white" />,
                classNames: successStyles,
            });

            if (clean) notifications.clean();
        },
    };
}
