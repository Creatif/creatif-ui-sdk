import { Button, Modal, TextInput } from '@mantine/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/structures/modals/css/modal.module.css';
import { IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';

interface Props {
    structureName: string;
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function RemoveModal({ open, onClose, onConfirm, structureName }: Props) {
    const [typedName, setTypedName] = useState('');

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
                <h1 className={styles.header}>
                    You are about to truncate <span className={styles.boldHighlight}>{structureName}</span>
                </h1>
                <p className={styles.text}>
                    Remove this structure will remove all items in it <span className={styles.boldHighlight}>and</span>
                    the structure itself. <span>All data related to this structure will be lost</span>. If you used any
                    items of this structure as connections, those connections will{' '}
                    <span className={styles.boldHighlight}>no longer work</span>.
                </p>

                <p className={styles.text}>
                    If you only want to remove all items in this structure, consider truncating. Truncating will remove
                    all items in your structure but not the structure itself.
                </p>

                <p className={styles.text}>
                    Please, type in the name of this structure to confirm that you understand.
                </p>

                <TextInput
                    className={styles.structureNameInput}
                    label="Structure name"
                    value={typedName}
                    onChange={(e) => {
                        setTypedName(e.target.value);
                    }}
                />

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
                        disabled={typedName !== structureName}
                        styles={{
                            root: {
                                width: '50%',
                            },
                        }}
                        onClick={() => onConfirm()}
                        color="red">
                        Delete
                    </Button>
                </div>
            </Modal>
        </>
    );
}
