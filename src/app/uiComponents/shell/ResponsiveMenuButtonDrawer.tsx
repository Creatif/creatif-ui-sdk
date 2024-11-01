// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shell/css/responsiveMenuButton.module.css';
import { IconLayoutSidebarRightCollapse } from '@tabler/icons-react';
import { Drawer } from '@mantine/core';
import Navigation from '@app/uiComponents/shell/Navigation';
import type { AppShellItem } from '@root/types/shell/shell';
import { useState } from 'react';

interface Props {
    navItems: AppShellItem[];
}

export function ResponsiveMenuButtonDrawer({ navItems }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button onClick={() => setOpen((o) => !o)} className={styles.root}>
                <IconLayoutSidebarRightCollapse size={28} className={styles.icon} />
            </button>

            <Drawer
                styles={{
                    body: {
                        padding: '0px',
                    },
                }}
                position="left"
                opened={open}
                onClose={() => setOpen(false)}>
                <Navigation displayBlockWhenMobile={open} navItems={navItems} />
            </Drawer>
        </>
    );
}
