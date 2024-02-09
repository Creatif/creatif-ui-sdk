// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shared/css/modal.module.css';
import { Button, type ComboboxItem, Modal, Select } from '@mantine/core';
import { useState } from 'react';
import { Runtime } from '@app/runtime/Runtime';

interface Props {
    open: boolean;
    onClose: () => void;
    onEdit: (locale: string) => void;
    currentLocale: string;
}

export default function EditLocaleModal({ open, onClose, onEdit, currentLocale }: Props) {
    const [value, setValue] = useState<string>(currentLocale);
    const data = Runtime.instance.localesCache.getLocales() || [];

    return (
        <>
            <Modal opened={Boolean(open)} onClose={onClose} centered>
                <Select
                    comboboxProps={{
                        transitionProps: { transition: 'pop', duration: 200 },
                    }}
                    searchable
                    clearable
                    value={value}
                    onChange={(v) => {
                        if (v) setValue(v);
                    }}
                    filter={({ options, search }) => {
                        const filtered = (options as ComboboxItem[]).filter((option) =>
                            option.label.toLowerCase().trim().includes(search.toLowerCase().trim()),
                        );

                        filtered.sort((a, b) => a.label.localeCompare(b.label));
                        return filtered;
                    }}
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
