import {Button, Modal} from '@mantine/core';
import styles from './css/DeleteModal.module.css';

interface Props {
    open: string;
    onClose: () => void;
    onDelete: (id: string) => void;
}
export default function DeleteModal({open, onClose, onDelete}: Props) {
	return (
		<>
			<Modal opened={Boolean(open)} onClose={onClose} centered>
				<p className={styles.text}>
                    Are you sure? This action cannot be undone and this item will
                    be deleted.
				</p>

				<div className={styles.buttonGroup}>
					<Button onClick={onClose} variant="light" color="gray">
                        Cancel
					</Button>

					<Button onClick={() => onDelete(open)} color="red">
                        Delete
					</Button>
				</div>
			</Modal>
		</>
	);
}