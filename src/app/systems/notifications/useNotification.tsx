import {notifications} from '@mantine/notifications';
import {IconAlertTriangle, IconExclamationCircle, IconInfoCircle} from '@tabler/icons-react';
import errStyles from './error.module.css';
import warnStyles from './warn.module.css';
import infoStyles from './warn.module.css';

export default function useNotification() {
	return {
		warn: (title: string, description: React.ReactNode) => {
			notifications.show({
				withCloseButton: true,
				autoClose: 10000,
				title: title,
				message: description,
				icon:  <IconExclamationCircle color="white" />,
				color: 'orange',
				classNames: warnStyles,
			});
		},
		error: (title: string, description: React.ReactNode) => {
			console.log(title, description);
			notifications.show({
				withCloseButton: true,
				autoClose: 10000,
				styles: (theme) => ({
					title: { color: theme.white },
					description: { color: theme.white },
				}),
				title: title,
				message: description,
				icon: <IconAlertTriangle color="white" />,
				classNames: errStyles,
			});
		},
		info: (title: string, description: React.ReactNode) => {
			notifications.show({
				withCloseButton: true,
				autoClose: 10000,
				withBorder: true,
				title: title,
				message: description,
				icon: <IconInfoCircle color="gray" />,
				classNames: infoStyles,
			});
		}
	};
}