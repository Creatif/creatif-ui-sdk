import { Initialize } from '@app/initialize';
import useNotification from '@app/systems/notifications/useNotification';
import SupportedLocalesModal from '@app/uiComponents/appShells/singleColumn/SupportedLocalesModal';
import CurrentLocaleStorage from '@lib/storage/currentLocaleStorage';
import { Button, Select } from '@mantine/core';
import { IconStackPush } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import styles from './css/header.module.css';
import type { Locale } from '@lib/api/project/types/SupportedLocales';
import type { PropsWithChildren } from 'react';

function localesToSelectOptions(data: Locale[] | undefined) {
	if (!data) return [];

	return data.map((item) => ({
		value: item.alpha,
		label: `${item.name} - ${item.alpha}`,
	}));
}
export default function Header({ children }: PropsWithChildren) {
	const { warn, info } = useNotification();
	const queryClient = useQueryClient();
	const [locales, setLocales] = useState<Locale[] | undefined>(undefined);
	const [currentLocale, setCurrentLocale] = useState<string>(Initialize.Locale());
	const [isLocalesModalOpen, setIsLocalesModalOpen] = useState(false);

	useEffect(() => {
		const cachedLocales = queryClient.getQueryData('supported_locales');
		if (cachedLocales === 'failed') {
			warn(
				'Warning! Locales failed to load.',
				`Locales could not be loaded. Please, try refreshing your browser. If that does not work, locale is set to last locale that you used which is '${Initialize.Locale()}'. If that is not your desired locale, please be patient until we fix this issue.`,
				false,
			);
			return;
		}

		setLocales(cachedLocales as Locale[]);
	}, []);

	return (
		<header className={styles.header}>
			<div className={styles.contentWrapper}>
				{children}

				<div className={styles.actionRoot}>
					<div>
						<Select
							value={currentLocale}
							onChange={(val) => {
								if (val) {
									setCurrentLocale(val);
									CurrentLocaleStorage.instance.setLocale(val);
									Initialize.changeLocale(val);
									info('Locale changed', `Locale changed to '${Initialize.Locale()}'`);
								}
							}}
							disabled={queryClient.getQueryData('supported_locales') === 'failed'}
							comboboxProps={{
								transitionProps: { transition: 'pop', duration: 200 },
							}}
							searchable
							size="sm"
							defaultValue="eng"
							data={localesToSelectOptions(locales)}
						/>
						<span onClick={() => setIsLocalesModalOpen(true)} className={styles.supportedLocalesAction}>
                            View supported locales?
						</span>
					</div>

					<Button color="green" leftSection={<IconStackPush size={24} />}>
                        Publish
					</Button>
				</div>
			</div>

			<SupportedLocalesModal open={isLocalesModalOpen} onClose={() => setIsLocalesModalOpen(false)} />
		</header>
	);
}
