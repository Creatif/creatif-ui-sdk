import { Button, Modal } from '@mantine/core';
import styles from './css/DeleteModal.module.css';
interface Props {
    open: boolean;
    message: string;
    onClose: () => void;
    onDelete: () => void;
}
export default function DeleteModal({ open, message, onClose, onDelete }: Props) {
	return (
		<>
			<Modal opened={Boolean(open)} onClose={onClose} centered>
				<p className={styles.text}>{message}</p>

				<div className={styles.buttonGroup}>
					<Button onClick={onClose} variant="light" color="gray">
                        Cancel
					</Button>

					<Button onClick={() => onDelete()} color="red">
                        Delete
					</Button>
				</div>
			</Modal>
		</>
	);
}
