import type { PropsWithChildren } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/components/css/basicInfo.module.css';

export function BasicInfo({ children }: PropsWithChildren) {
    return <div className={styles.root}>{children}</div>;
}
