// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/publishing/css/resultHeader.module.css';

interface Props {
    title: string;
}

export function ResultHeader({ title }: Props) {
    return (
        <div className={styles.root}>
            <h2 className={styles.title}>{title}</h2>
        </div>
    );
}
