import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { Loader } from '@mantine/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/FirstTimeSetup.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import animations from '@app/css/animations.module.css';
import classNames from 'classnames';
import { Credentials } from '@app/credentials';
import createList from '@lib/api/declarations/lists/createList';
import UIError from '@app/components/UIError';
import createMap from '@lib/api/declarations/maps/createMap';
import InitialSetup from '@lib/storage/initialSetup';
async function createLists(lists: { [key: string]: boolean }) {
    const keys = Object.keys(lists);
    for (const key of keys) {
        if (lists[key]) continue;

        const { result, error } = await createList({
            name: key,
            projectId: Credentials.ProjectID(),
        });

        if (error) {
            return error;
        }

        if (result) {
            InitialSetup.instance.markListDone(key);
        }
    }
}

async function createMaps(maps: { [key: string]: boolean }) {
    const keys = Object.keys(maps);
    for (const key of keys) {
        if (maps[key]) continue;

        const { result, error } = await createMap({
            name: key,
            projectId: Credentials.ProjectID(),
        });

        if (error) {
            return error;
        }

        if (result) {
            InitialSetup.instance.markMapDone(key);
        }
    }
}

export default function FirstTimeSetup({ children }: PropsWithChildren) {
    const [status, setStatus] = useState<'preparation' | 'checking' | 'ready' | 'error'>('preparation');

    useEffect(() => {
        const currentLists = InitialSetup.instance.lists();
        const currentMaps = InitialSetup.instance.maps();

        const ready = [...Object.values(currentLists), ...Object.values(currentMaps)].every((item) => item);
        if (ready) {
            setStatus('ready');
            return;
        }

        createLists(currentLists).then((error) => {
            if (error) {
                setStatus('error');
                return;
            }
        });

        createMaps(currentMaps).then((error) => {
            if (error) {
                setStatus('error');
                return;
            }

            setStatus('ready');
        });
    }, []);

    return (
        <>
            {status === 'checking' && (
                <div className={classNames(styles.root, animations.initialAnimation)}>
                    <Loader type="dots" size={64} />
                    <p>Preparing your application. This won&apos;t take long...</p>
                </div>
            )}

            {status === 'error' && (
                <div className={classNames(styles.root, animations.initialAnimation)}>
                    <UIError title="Something wrong happened">
                        Preparation could not be completed successfully. We apologize for this error. A report has been
                        sent and we are looking into it. Please, try again later.
                    </UIError>
                </div>
            )}

            {status === 'ready' && children}
        </>
    );
}
