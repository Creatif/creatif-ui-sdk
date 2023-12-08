import styles from './FormGrid.module.css';
import type { PropsWithChildren } from 'react';
export default function FormGrid({ children }: PropsWithChildren) {
	return <div className={styles.root}>{children}</div>;
}
