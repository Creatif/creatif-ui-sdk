// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from '@app/components/authentication/css/stepOne.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import shared from '@app/components/authentication/css/shared.module.css';
import { Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import classNames from 'classnames';

export interface Props {
    onContinue: () => void;
}

export function StepOne({ onContinue }: Props) {
    const [exit, setExit] = useState(0);

    useEffect(() => {
        if (exit === 1) {
            setTimeout(() => {
                setExit(2);
            }, 400);
        }

        if (exit === 2) {
            onContinue();
        }
    }, [exit]);

    return (
        <div className={classNames(css.root, exit === 1 ? css.fadeOutStart : undefined)}>
            <p className={css.paragraph}>
                Creatif requires a single admin user. After you create this user, you can create other users but there
                must always be one admin user. In the next screen, you will create the admin user.
            </p>

            <div className={shared.button}>
                <Button
                    onClick={() => {
                        setExit(1);
                    }}>
                    Continue
                </Button>
            </div>
        </div>
    );
}
