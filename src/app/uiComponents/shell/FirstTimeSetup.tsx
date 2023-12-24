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
import { Initialize } from '@app/initialize';
import createList from '@lib/api/declarations/lists/createList';
import UIError from '@app/components/UIError';
import type { TryResult } from '@root/types/shared';
interface Props {
    lists: string[];
    maps: string[];
}

function checkAlreadyDone(
    currentLists: string[],
    currentMaps: string[],
    incomingLists: string[],
    incomingMaps: string[],
): boolean {
    const currentJoin = [currentLists.join(','), currentMaps.join(',')].join(',');
    const incomingJoin = [incomingLists.join(','), incomingMaps.join(',')].join(',');
    return currentJoin === incomingJoin;
}

function createPromise(fn: () => Promise<TryResult<unknown>>) {
    return new Promise((resolve, reject) => {
        fn().then(({ result, error }) => {
            if (result) resolve(result);
            if (error && error.error.data['exists']) {
                resolve(true);
                return;
            }
            if (error) reject(error);
        });
    });
}

// diff those that are in 'incoming' but not in 'current'
function createPreparationDiff(
    currentList: string[],
    currentMaps: string[],
    incomingList: string[],
    incomingMaps: string[],
) {
    const diff: { type: 'list' | 'map'; name: string }[] = [];

    for (const incoming of incomingList) {
        if (!currentList.includes(incoming)) {
            diff.push({
                type: 'list',
                name: incoming,
            });
        }
    }

    for (const incoming of incomingMaps) {
        if (!currentMaps.includes(incoming)) {
            diff.push({
                type: 'map',
                name: incoming,
            });
        }
    }

    return diff;
}
export default function FirstTimeSetup({ children, lists, maps }: Props & PropsWithChildren) {
    const [status, setStatus] = useState<'preparation' | 'checking' | 'ready' | 'error'>('preparation');

    useEffect(() => {
        const key = 'creatif-initial-load';
        const initialLoadKeys = Object.keys(localStorage);
        if (!initialLoadKeys.includes(key)) {
            localStorage.setItem(
                key,
                JSON.stringify({
                    lists: [],
                    maps: [],
                }),
            );
        }

        const initialLoadData = JSON.parse(localStorage.getItem(key) as string);
        if (checkAlreadyDone(initialLoadData.lists, initialLoadData.maps, lists, maps)) {
            setStatus('ready');
            return;
        }

        const diff = createPreparationDiff(initialLoadData.lists, initialLoadData.maps, lists, maps);
        console.log(diff);
        const promises: Promise<unknown>[] = [];
        for (const t of diff) {
            if (t.type === 'list') {
                promises.push(createPromise(() => createList({ name: t.name, projectId: Initialize.ProjectID() })));
            }
        }

        Promise.all(promises)
            .then(() => {
                setStatus('ready');
                localStorage.removeItem(key);
                localStorage.setItem(
                    key,
                    JSON.stringify({
                        lists: lists,
                        maps: maps,
                    }),
                );
            })
            .catch(() => {
                setStatus('error');
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
