import {notifications} from '@mantine/notifications';
import {IconAlertTriangle, IconExclamationCircle, IconInfoCircle} from '@tabler/icons-react';
import errStyles from './error.module.css';
import warnStyles from './warn.module.css';
import infoStyles from './warn.module.css';

export default function useNotification() {
	return {
		warn: (title: string, description: string) => {
			notifications.show({
				withCloseButton: true,
				autoClose: 100000,
				title: title,
				message: description,
				icon:  <IconExclamationCircle color="gray" />,
				color: 'orange',
				classNames: warnStyles,
			});
		},
		error: (title: string, description: string) => {
			console.log(title, description);
			notifications.show({
				withCloseButton: true,
				autoClose: 100000,
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
		info: (title: string, description: string) => {
			notifications.show({
				withCloseButton: true,
				autoClose: 5000,
				title: title,
				message: description,
				icon: <IconInfoCircle />,
				classNames: infoStyles,
			});
		}
	};
}