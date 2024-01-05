// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/main.module.css';
import { IconArrowRight } from '@tabler/icons-react';
import { Drawer } from '@mantine/core';
import { useState } from 'react';
import DevBarContent from '@app/devBar/components/DevBarContent';
export default function DevBar() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <div className={styles.root} onClick={() => setIsOpen(true)}>
                <h2 className={styles.logoHeading}>CREATIF</h2>
                <p className={styles.devBarDescription}>
                    DEVELOPMENT BAR <IconArrowRight size={16} />
                </p>
            </div>

            <Drawer
                position="bottom"
                opened={isOpen}
                size="75%"
                closeOnEscape={true}
                closeOnClickOutside={true}
                onClose={() => setIsOpen(false)}>
                <DevBarContent />
            </Drawer>
        </>
    );
}
