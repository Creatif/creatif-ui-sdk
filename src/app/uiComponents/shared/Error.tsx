import UIError from '@app/components/UIError';
import React from 'react';

interface Props {
    title: string;
    message: string;
    show: boolean;
}

export function Error({ title, message, show }: Props) {
    return (
        <>
            {show && (
                <div
                    style={{
                        marginBottom: '1rem',
                    }}>
                    <UIError title={title}>{message}</UIError>
                </div>
            )}
        </>
    );
}
