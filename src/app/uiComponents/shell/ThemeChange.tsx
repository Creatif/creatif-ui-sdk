import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconMoon, IconSun } from '@tabler/icons-react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shell/css/themeChange.module.css';

export function ThemeChange() {
    const { setColorScheme } = useMantineColorScheme();
    const [themeToggle, setThemeToggle] = useState(
        localStorage.getItem('mantine-color-scheme-value') === 'light' ? false : true,
    );

    useEffect(() => {
        const theme = localStorage.getItem('mantine-color-scheme-value');
        if (!theme) {
            setColorScheme('light');
            setThemeToggle(false);
        }
    }, []);

    return (
        <ActionIcon
            variant="white"
            className={styles.button}
            onClick={() => {
                const tempToggle = !themeToggle;
                setThemeToggle(tempToggle);
                if (!tempToggle) setColorScheme('light');
                if (tempToggle) setColorScheme('dark');
            }}>
            {themeToggle && <IconSun className={styles.icon} size={16} />}
            {!themeToggle && <IconMoon className={styles.icon} size={16} />}
        </ActionIcon>
    );
}
