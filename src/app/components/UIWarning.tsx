import type { CSSProperties } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/components/css/uiWarning.module.css';
import { IconInfoCircle } from '@tabler/icons-react';
interface Props {
    title: string;
    style?: CSSProperties | undefined;
}
export function UIWarning({ title, style }: Props) {
    return (
        <div style={style} className={styles.root}>
            <IconInfoCircle size={36} color="var(--mantine-color-gray-7)" />

            <p className={styles.title}>{title}</p>
        </div>
    );
}
