import styles from '@app/uiComponents/listing/css/DeleteModal.module.css';
import { Button, Modal, Select } from '@mantine/core';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import type { Locale } from '@lib/api/project/types/SupportedLocales';

interface Props {
    open: boolean;
    onClose: () => void;
    onEdit: (locale: string) => void;
    currentLocale: string;
}

export default function EditLocaleModal({ open, onClose, onEdit, currentLocale }: Props) {
	const [value, setValue] = useState<string | null>(currentLocale);
	const data = (useQueryClient().getQueryData('supported_locales') as Locale[]) || [];

	return (
		<>
			<Modal opened={Boolean(open)} onClose={onClose} centered>
				<Select
					comboboxProps={{
						transitionProps: { transition: 'pop', duration: 200 },
					}}
					searchable
					value={value}
					onChange={(v) => setValue(v)}
					data={data.map((item) => ({
						label: `${item.name} - ${item.alpha}`,
						value: item.alpha,
					}))}
				/>

				<div className={styles.buttonGroup}>
					<Button onClick={onClose} variant="light" color="gray">
                        Cancel
					</Button>

					<Button disabled={!value} onClick={() => onEdit(value)}>
                        Edit
					</Button>
				</div>
			</Modal>
		</>
	);
}
