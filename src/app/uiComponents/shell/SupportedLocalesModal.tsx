// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shared/css/modal.module.css';
import { Button, Modal, ScrollArea, Table, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import type { Locale } from '@lib/api/project/types/SupportedLocales';
import LocalesCache from '@lib/storage/localesCache';
interface Props {
    open: boolean;
    onClose: () => void;
}
export default function SupportedLocalesModal({ open, onClose }: Props) {
    const [value, setValue] = useState<string>('');
    const locales = LocalesCache.instance.getLocales() || [];
    const [searchedLocales, setSearchedLocales] = useState<Locale[]>([]);
    const [debounced] = useDebouncedValue(value, 500);

    useEffect(() => {
        if (!debounced) {
            setSearchedLocales(locales);
            return;
        }

        const found: Locale[] = [];
        for (const locale of locales) {
            if (new RegExp(debounced).test(locale.alpha) || new RegExp(debounced).test(locale.name)) {
                found.push(locale);
            }
        }

        setSearchedLocales(found);
    }, [debounced]);

    const rows = searchedLocales.map((element) => (
        <Table.Tr key={element.alpha}>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>{element.alpha}</Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            <Modal size="lg" opened={Boolean(open)} onClose={onClose} centered>
                <TextInput
                    styles={{
                        input: { borderRadius: 4 },
                    }}
                    size="md"
                    value={value}
                    onChange={(e) => setValue(e.currentTarget.value)}
                    placeholder="Search"
                    leftSection={<IconSearch size={14} />}
                />

                {searchedLocales.length > 0 && (
                    <ScrollArea
                        style={{
                            marginTop: '3rem',
                            marginBottom: '3rem',
                        }}
                        h={250}>
                        <Table withTableBorder withColumnBorders>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th
                                        style={{
                                            fontWeight: 'bolder',
                                            width: '70%',
                                        }}>
                                        Name
                                    </Table.Th>
                                    <Table.Th
                                        style={{
                                            fontWeight: 'bolder',
                                            width: '30%',
                                        }}>
                                        Alpha
                                    </Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                    </ScrollArea>
                )}

                {searchedLocales.length === 0 && (
                    <p
                        style={{
                            textAlign: 'center',
                            margin: '3rem 0 3rem 0',
                            color: 'var(--mantine-color-gray-6)',
                        }}>
                        NOTHING FOUND
                    </p>
                )}

                <div className={styles.buttonGroup}>
                    <Button onClick={onClose} variant="light" color="gray">
                        Close
                    </Button>
                </div>
            </Modal>
        </>
    );
}
