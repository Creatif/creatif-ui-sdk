import { Button, Modal } from '@mantine/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '../css/modal.module.css';
import { IconAlertCircle } from '@tabler/icons-react';
interface Props {
    open: boolean;
    message: string;
    title?: string;
    onClose: () => void;
    onDelete: () => void;
}
export default function DeleteModal({ open, message, onClose, onDelete }: Props) {
    return (
        <>
            <Modal
                styles={{
                    header: {
                        backgroundColor: 'var(--mantine-color-red-1)',
                    },
                }}
                opened={Boolean(open)}
                title={<IconAlertCircle color="var(--mantine-color-red-5)" size={24} />}
                onClose={onClose}
                centered>
                <h1 className={styles.header}>You are about to delete an item</h1>
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
                        onClick={() => onDelete()}
                        color="red">
                        Delete
                    </Button>
                </div>
            </Modal>
        </>
    );
}
