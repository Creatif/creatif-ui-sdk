// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/AuthPage.module.css';
import type { PropsWithChildren } from 'react';
export default function AuthPage({children}: PropsWithChildren) {
    return <div className={styles.auth}>
        {children}
    </div>;
}