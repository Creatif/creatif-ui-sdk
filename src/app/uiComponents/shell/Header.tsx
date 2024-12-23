import useNotification from '@app/systems/notifications/useNotification';
import SupportedLocalesModal from '@app/uiComponents/shell/SupportedLocalesModal';
import { type ComboboxItem, Select } from '@mantine/core';
import { useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/header.module.css';
import type { Locale } from '@lib/api/project/types/SupportedLocales';
import { Runtime } from '@app/systems/runtime/Runtime';
import { PublishButton } from '@app/uiComponents/shell/PublishButton';
import { ThemeChange } from '@app/uiComponents/shell/ThemeChange';
import { ResponsiveMenuButtonDrawer } from '@app/uiComponents/shell/ResponsiveMenuButtonDrawer';
import type { AppShellItem } from '@root/types/shell/shell';

interface Props {
    navItems: AppShellItem[];
}

function localesToSelectOptions(data: Locale[] | undefined) {
    if (!data) return [];

    return data.map((item) => ({
        value: item.alpha,
        label: `${item.name} - ${item.alpha}`,
    }));
}

export default function Header({ navItems }: Props) {
    const { info } = useNotification();

    const [locales, setLocales] = useState<Locale[] | undefined>(undefined);
    const [currentLocale, setCurrentLocale] = useState<string>(Runtime.instance.currentLocaleStorage.getLocale());
    const [isLocalesModalOpen, setIsLocalesModalOpen] = useState(false);

    useEffect(() => {
        setLocales(Runtime.instance.localesCache.getLocales() || []);
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.contentWrapper}>
                <ResponsiveMenuButtonDrawer navItems={navItems} />

                <div className={styles.actionRoot}>
                    <div>
                        <Select
                            value={currentLocale}
                            onChange={(val) => {
                                if (val) {
                                    setCurrentLocale(val);
                                    Runtime.instance.currentLocaleStorage.setLocale(val);
                                    info(
                                        'Locale changed',
                                        `Locale changed to '${Runtime.instance.currentLocaleStorage.getLocale()}'`,
                                    );
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

                    <div className={styles.publishButtonAndTheme}>
                        <PublishButton />

                        <ThemeChange />
                    </div>
                </div>
            </div>

            <SupportedLocalesModal open={isLocalesModalOpen} onClose={() => setIsLocalesModalOpen(false)} />
        </header>
    );
}
