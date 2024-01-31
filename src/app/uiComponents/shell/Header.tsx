import { Credentials } from '@app/credentials';
import useNotification from '@app/systems/notifications/useNotification';
import SupportedLocalesModal from '@app/uiComponents/shell/SupportedLocalesModal';
import CurrentLocaleStorage from '@lib/storage/currentLocaleStorage';
import { Button, type ComboboxItem, Select } from '@mantine/core';
import { IconStackPush } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/header.module.css';
import type { Locale } from '@lib/api/project/types/SupportedLocales';
import LocalesCache from '@lib/storage/localesCache';
function localesToSelectOptions(data: Locale[] | undefined) {
    if (!data) return [];

    return data.map((item) => ({
        value: item.alpha,
        label: `${item.name} - ${item.alpha}`,
    }));
}
export default function Header() {
    const { info } = useNotification();
    const [locales, setLocales] = useState<Locale[] | undefined>(undefined);
    const [currentLocale, setCurrentLocale] = useState<string>(Credentials.Locale());
    const [isLocalesModalOpen, setIsLocalesModalOpen] = useState(false);

    useEffect(() => {
        setLocales(LocalesCache.instance.getLocales() || []);
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.contentWrapper}>
                <div className={styles.actionRoot}>
                    <div>
                        <Select
                            value={currentLocale}
                            onChange={(val) => {
                                if (val) {
                                    setCurrentLocale(val);
                                    CurrentLocaleStorage.instance.setLocale(val);
                                    Credentials.changeLocale(val);
                                    info('Locale changed', `Locale changed to '${Credentials.Locale()}'`);
                                }
                            }}
                            filter={({ options, search }) => {
                                const filtered = (options as ComboboxItem[]).filter((option) =>
                                    option.label.toLowerCase().trim().includes(search.toLowerCase().trim()),
                                );

                                filtered.sort((a, b) => a.label.localeCompare(b.label));
                                return filtered;
                            }}
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
