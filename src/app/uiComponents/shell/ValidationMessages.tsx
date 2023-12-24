// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/ValidationMessages.module.css';
import { IconAlertTriangle } from '@tabler/icons-react';

interface Props {
    messages: string[];
}
export default function ValidationMessages({messages}: Props) {
    return <div className={styles.root}>
        <h1 className={styles.header}>
            <IconAlertTriangle size={48} color="red" />
            There are some problems with your application configuration. Please, resolve them in order to authenticate.
        </h1>

        {messages.map((item, i) => <p className={styles.item} key={i}>{item}</p>)}
    </div>;
}