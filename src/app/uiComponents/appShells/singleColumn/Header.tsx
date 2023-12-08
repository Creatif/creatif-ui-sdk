import useNotification from '@app/systems/notifications/useNotification';
import { app } from '@lib/http/axios';
import useHttpQuery from '@lib/http/useHttpQuery';
import { Button, Select } from '@mantine/core';
import { IconStackPush } from '@tabler/icons-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './css/header.module.css';
import type { PropsWithChildren } from 'react';

function localesToSelectOptions(
	data: { name: string; alpha: string }[] | undefined,
) {
	if (!data) return [];

	return data.map((item) => ({
		value: item.alpha,
		label: `${item.name} - ${item.alpha}`,
	}));
}
export default function Header({ children }: PropsWithChildren) {
	const { warn } = useNotification();
	const { locale } = useParams();

	const { isFetching, data, error } = useHttpQuery<
    { name: string; alpha: string }[]
  >(app(), 'supported_locales', '/supported-locales', {
  	onError: () => {
  		warn(
  			'Warning! Locales failed to load.',
  			'Locales could not be loaded. Please, try refreshing your browser. If that does not work, the default locale is set to English. If that is not your desired locale, please be patient until we fix this issue.',
  			false,
  		);
  	},
  });
	const [currentLocale, setCurrentLocale] = useState<string | null>(
		locale || 'eng',
	);

	return (
		<header className={styles.header}>
			<div className={styles.contentWrapper}>
				{children}

				<div className={styles.actionRoot}>
					<div>
						<Select
							value={currentLocale}
							onChange={(val) => setCurrentLocale(val)}
							disabled={isFetching || Boolean(error)}
							comboboxProps={{
								transitionProps: { transition: 'pop', duration: 200 },
							}}
							searchable
							size="sm"
							defaultValue="eng"
							data={localesToSelectOptions(data)}
						/>
						<span className={styles.supportedLocalesAction}>
              View supported locales?
						</span>
					</div>

					<Button color="green" leftSection={<IconStackPush size={24} />}>
            Publish
					</Button>
				</div>
			</div>
		</header>
	);
}
