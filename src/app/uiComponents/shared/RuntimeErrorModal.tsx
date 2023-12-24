import { Modal } from '@mantine/core';
import React from 'react';

interface Props {
    open: boolean;
    error: RuntimeError | null;
}

export interface RuntimeError {
    message: React.ReactNode;
}

export default function RuntimeErrorModal({ open, error }: Props) {
    return (
        <>
            <Modal styles={{
                header: {
                    backgroundColor: 'var(--mantine-color-red-7)',
                    padding: '1.3rem',
                    color: 'white',
                    fontWeight: 500,
                },
                close: {
                    display: 'none',
                },
                content: {
                    backgroundColor: 'var(--mantine-color-red-5)',
                    color: 'white',
                },
                body: {
                    padding: 0,
                }
            }} opened={Boolean(open)} title="RUNTIME ERROR" closeOnClickOutside={false} closeOnEscape={false} onClose={() => {}} centered>
                <p style={{
                    margin: '1rem 0 1rem 0',
                    padding: '1rem',
                    lineHeight: '1.3rem',
                    letterSpacing: '0.5px'
                }}>{error && error.message}</p>

                <p style={{
                    border: '1px solid red',
                    padding: '1rem',
                    backgroundColor: 'var(--mantine-color-red-7)',
                }}>The app cannot be usable until you resolve this runtime error.</p>
            </Modal>
        </>
    );
}
