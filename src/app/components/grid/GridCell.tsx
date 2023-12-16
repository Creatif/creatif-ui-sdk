import styles from './GridCell.module.css';
import type { PropsWithChildren } from 'react';
export default function GridCell({ children }: PropsWithChildren) {
    return <div className={styles.root}>{children}</div>;
}
