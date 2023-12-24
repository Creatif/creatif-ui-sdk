// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/Banner.module.css';

export default function Banner() {
    return (
        <div className={styles.banner}>
            <div className={styles.banner__text}>
                <p className={styles.banner__textMain}>CREATIF</p>
                <p className={styles.banner__textSecondary}>IT&apos;S THAT SIMPLE</p>
            </div>
        </div>
    );
}
