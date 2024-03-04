// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/publishing/css/publishingMain.module.css';
import { PublishForm } from '@app/uiComponents/publishing/PublishForm';
import { VersionList } from '@app/uiComponents/publishing/VersionList';
import { useState } from 'react';
import UIError from '@app/components/UIError';

export function PublishingMain() {
    const [listLength, setListLength] = useState(-1);

    return (
        <div className={styles.root}>
            <h1 className={styles.heading}>Publish a new version</h1>

            <PublishForm listLength={listLength} />

            <VersionList onListLength={(l) => setListLength(l)} />
        </div>
    );
}
