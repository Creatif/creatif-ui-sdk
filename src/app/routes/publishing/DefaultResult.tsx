import type { Version } from '@root/types/api/publicApi/Version';
import { ResultHeader } from '@app/routes/publishing/ResultHeader';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import versionList from '@app/routes/publishing/css/versionList.module.css';
import React from 'react';
import { Item } from '@app/routes/publishing/Item';

interface Props {
    version: Version;
    onUpdateInProgress: (isInProgress: boolean) => void;
    isUpdateInProgress: boolean;
}

export function DefaultResult({ version, isUpdateInProgress, onUpdateInProgress }: Props) {
    return (
        <div>
            <ResultHeader title="UP TO DATE DEFAULT VERSION" />

            <div className={versionList.gridRoot}>
                <div className={versionList.columnGrid}>
                    <p className={versionList.column}>NAME</p>
                    <p className={versionList.column}>CREATED AT</p>
                    <p className={versionList.column} />
                </div>

                <Item
                    isUpdateInProgress={isUpdateInProgress}
                    onUpdateInProgress={(isInProgress) => onUpdateInProgress(isInProgress)}
                    key={version.id}
                    version={version}
                />
            </div>
        </div>
    );
}
