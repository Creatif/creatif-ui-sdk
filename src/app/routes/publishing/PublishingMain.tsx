// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/publishing/css/publishingMain.module.css';
import { PublishForm } from '@app/routes/publishing/PublishForm';
import { VersionList } from '@app/routes/publishing/VersionList';
import { useState } from 'react';
import { RuntimeValidationModal } from '@app/uiComponents/shared/RuntimeValidationModal';

interface Props {
    validationMessages: string[] | null;
}

export default function PublishingMain({ validationMessages }: Props) {
    const [listLength, setListLength] = useState(-1);

    return (
        <div className={styles.root}>
            <h1 className={styles.heading}>Publish a new version</h1>

            <PublishForm listLength={listLength} />

            <VersionList onListLength={(l) => setListLength(l)} />

            {validationMessages && <RuntimeValidationModal validationMessages={validationMessages} />}
        </div>
    );
}
