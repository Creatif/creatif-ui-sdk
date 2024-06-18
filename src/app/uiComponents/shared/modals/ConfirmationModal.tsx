import { Button, Modal } from '@mantine/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shared/css/modal.module.css';
import { IconInfoCircle } from '@tabler/icons-react';
interface Props {
    open: boolean;
    message: string;
    header: string;
    onClose: () => void;
    onConfirm: () => void;
}
export default function ConfirmationModal({ open, message, header, onClose, onConfirm }: Props) {
    return (
        <>
            <Modal
                opened={Boolean(open)}
                styles={{
                    header: {
                        backgroundColor: 'var(--mantine-color-red-9)',
                    },
                }}
                title={<IconInfoCircle color="var(--mantine-color-white)" size={24} />}
                onClose={onClose}
                closeButtonProps={{
                    style: {
                        color: 'white',
                        backgroundColor: 'var(--mantine-color-red-9)',
                    },
                }}
                centered>
                <h1 className={styles.header}>{header}</h1>
                <p className={styles.text}>{message}</p>

                <div className={styles.buttonGroup}>
                    <Button
                        styles={{
                            root: {
                                width: '50%',
                            },
                        }}
                        onClick={onClose}
                        variant="light"
                        color="gray">
                        Cancel
                    </Button>

                    <Button
                        styles={{
                            root: {
                                width: '50%',
                            },
                        }}
                        onClick={() => onConfirm()}
                        color="var(--mantine-color-indigo-9)">
                        Confirm
                    </Button>
                </div>
            </Modal>
        </>
    );
}
