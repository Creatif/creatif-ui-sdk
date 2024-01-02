import JSON from '@app/uiComponents/external/Json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/lists/list/css/ValueMetadata.module.css';
import { Button } from '@mantine/core';
import { IconArrowsDiagonal2, IconArrowsDiagonalMinimize } from '@tabler/icons-react';
import { useState } from 'react';
import type { PaginatedVariableResult } from '@root/types/api/list';
interface Props<Value, Metadata> {
    item: PaginatedVariableResult<Value, Metadata>;
}
export default function ValueMetadata<Value, Metadata>({ item }: Props<Value, Metadata>) {
    const [isValueExpanded, setIsValueExpanded] = useState(false);
    const [isMetadataExpanded, setIsMetadataExpanded] = useState(false);

    return (
        <div className={styles.metadataValueContainer}>
            <div className={styles.valueContainer}>
                <h2 className={styles.valueMetadataTitle}>VALUE</h2>

                <div>
                    {item.value && (
                        <div className={isValueExpanded ? styles.rawValueContainerExpanded : styles.rawValueContainer}>
                            <JSON value={item.value} />
                        </div>
                    )}

                    {item.value && (
                        <div className={isValueExpanded ? styles.containerShowMoreExpanded : styles.containerShowMore}>
                            <Button
                                onClick={() => setIsValueExpanded((item) => !item)}
                                variant="subtle"
                                leftSection={
                                    !isValueExpanded ? (
                                        <IconArrowsDiagonal2 size={20} />
                                    ) : (
                                        <IconArrowsDiagonalMinimize />
                                    )
                                }
                                color="gray"
                                style={{
                                    zIndex: 5,
                                }}>
                                {isValueExpanded ? 'Show less' : 'Show more'}
                            </Button>
                        </div>
                    )}

                    {!item.value && <p className={styles.nothingFound}>NO VALUE FOUND</p>}
                </div>
            </div>

            <div className={styles.valueContainer}>
                <h2 className={styles.valueMetadataTitle}>METADATA</h2>

                <div>
                    {item.metadata && (
                        <div
                            className={
                                isMetadataExpanded ? styles.rawValueContainerExpanded : styles.rawValueContainer
                            }>
                            <JSON value={item.metadata} />
                        </div>
                    )}

                    {item.metadata && (
                        <div
                            className={
                                isMetadataExpanded ? styles.containerShowMoreExpanded : styles.containerShowMore
                            }>
                            <Button
                                onClick={() => setIsMetadataExpanded((item) => !item)}
                                variant="subtle"
                                leftSection={
                                    !isMetadataExpanded ? (
                                        <IconArrowsDiagonal2 size={20} />
                                    ) : (
                                        <IconArrowsDiagonalMinimize />
                                    )
                                }
                                color="gray"
                                style={{
                                    zIndex: 5,
                                }}>
                                {isMetadataExpanded ? 'Show less' : 'Show more'}
                            </Button>
                        </div>
                    )}

                    {!item.metadata && <p className={styles.nothingFound}>NO METADATA FOUND</p>}
                </div>
            </div>
        </div>
    );
}
