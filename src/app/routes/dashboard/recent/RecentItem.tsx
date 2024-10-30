// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/dashboard/css/resent.module.css';
import { IconArrowBigRightLines } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export function RecentItem() {
    return (
        <Link to="" className={styles.itemRoot}>
            <p>Create an account</p>
            <IconArrowBigRightLines />
        </Link>
    );
}
