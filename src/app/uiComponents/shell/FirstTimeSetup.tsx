import type { PropsWithChildren } from 'react';
import { useState, useEffect } from 'react';
import { Loader } from '@mantine/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/FirstTimeSetup.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import animations from '@app/css/animations.module.css';
import classNames from 'classnames';
import UIError from '@app/components/UIError';
import { getFirstTimeSetupStore } from '@app/systems/stores/firstTimeSetupStore';
import type { IncomingStructureItem } from '@app/systems/stores/projectMetadataStore';
import { createProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import type { StructureType } from '@root/types/shell/shell';

export default function FirstTimeSetup({ children }: PropsWithChildren) {
    const useFirstTimeSetupStore = getFirstTimeSetupStore();
    const { startSetup, run, currentStage, close, projectMetadata, createdStructures } = useFirstTimeSetupStore();
    const [isSetupFinished, setIsSetupFinished] = useState(false);

    useEffect(() => {
        startSetup();
        run();
    }, []);

    useEffect(() => {
        if (currentStage === 'finished' && createdStructures && !isSetupFinished) {
            const validResults: IncomingStructureItem[] = [];
            for (const item of createdStructures) {
                if (item.result) {
                    validResults.push({
                        id: item.result.id,
                        shortId: item.result.shortId,
                        name: item.result.name,
                        structureType: item.key,
                    });
                }
            }

            createProjectMetadataStore(projectMetadata, [
                ...projectMetadata.lists.map((item) => ({
                    id: item.id,
                    shortId: item.shortId,
                    structureType: 'list' as StructureType,
                    name: item.name,
                })),
                ...projectMetadata.maps.map((item) => ({
                    id: item.id,
                    shortId: item.shortId,
                    structureType: 'map' as StructureType,
                    name: item.name,
                })),
                ...validResults,
            ]);

            setIsSetupFinished(true);
            setTimeout(() => {
                close();
            }, 1000);
        }
    }, [currentStage, createdStructures, isSetupFinished]);

    return (
        <>
            {currentStage === 'creatingStructures' && (
                <div className={classNames(styles.root, animations.initialAnimation)}>
                    <Loader type="dots" size={64} />
                    <p>Preparing your application. This won&apos;t take long...</p>
                </div>
            )}

            {currentStage === 'error' && (
                <div className={classNames(styles.root, animations.initialAnimation)}>
                    <UIError title="Something wrong happened">
                        Preparation could not be completed successfully. We apologize for this error. A report has been
                        sent and we are looking into it. Please, try again later.
                    </UIError>
                </div>
            )}

            {isSetupFinished && children}
        </>
    );
}
