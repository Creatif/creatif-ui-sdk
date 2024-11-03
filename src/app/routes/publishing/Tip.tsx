// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/publishing/css/tip.module.css';
import { useState } from 'react';

export function Tip() {
    const [showTip, setShowTip] = useState(false);
    return (
        <div className={styles.root}>
            <h2 className={styles.tipHeader} onClick={() => setShowTip((t) => !t)}>
                Show tip?
            </h2>

            {showTip && (
                <p>
                    For most applications, a single version is enough. When it is outdated, just update it. In cases
                    where you have a legacy system that uses an outdated version, multiple versions might come in handy
                    while working on the most update to date one.
                </p>
            )}
        </div>
    );
}
