import { Button, Modal } from '@mantine/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shared/css/modal.module.css';
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
                classNames={{
                    header: styles.dangerTitle,
                }}
                opened={Boolean(open)}
                title={<IconAlertCircle className={styles.alertIcon} size={24} />}
                closeButtonProps={{
                    className: styles.closeIcon,
                }}
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
