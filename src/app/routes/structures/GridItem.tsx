// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/lists/css/listGridItem.module.css';
import React, { useRef, memo, useState, forwardRef } from 'react';
import appDate from '@lib/helpers/appDate';
import type { ListStructure, MapStructure } from '@root/types/api/structures';
import { IconCheck, IconCircleX, IconEraser, IconTrash } from '@tabler/icons-react';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import type { StructureType } from '@root/types/shell/shell';
import { ActionIcon, Tooltip, Table } from '@mantine/core';
import TruncateModal from '@app/routes/structures/modals/TruncateModal';
import { useMutation } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import { Runtime } from '@app/systems/runtime/Runtime';
import { truncateStructure } from '@lib/api/structures/truncateStructure';
import useNotification from '@app/systems/notifications/useNotification';
import RemoveModal from '@app/routes/structures/modals/RemoveModal';
import { removeStructure } from '@lib/api/structures/removeStructure';

interface Props {
    item: ListStructure | MapStructure;
    structureType: StructureType;
    onStructureRemoved: () => void;
}

const TableRow = forwardRef<HTMLTableRowElement, React.ComponentPropsWithoutRef<'tr'>>((props, ref) => (
    <Table.Tr {...props} ref={ref} />
));
TableRow.displayName = 'TableRow';

function GridItem({ item, structureType, onStructureRemoved }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const store = getProjectMetadataStore();
    const existsInConfig = store.getState().existsInConfig(item.id, structureType);

    const [openTruncateModal, setOpenTruncateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const { success, error } = useNotification();

    const rootClassName = existsInConfig ? styles.actionIconOverrideDisabled : styles.actionIconDeleteOverride;
    const iconColor = existsInConfig ? 'var(--mantine-color-gray-4)' : 'var(--mantine-color-red-9)';
    const tooltipTruncateContent = existsInConfig
        ? 'You must remove this item from configuration to be able to truncate it.'
        : 'Truncate item';
    const tooltipRemoveContent = existsInConfig
        ? 'You must remove this item from configuration to be able to delete it.'
        : 'Delete item';

    const { isLoading: isTruncateLoading, mutate: truncate } = useMutation<unknown, ApiError, void>(
        () =>
            truncateStructure({
                projectId: Runtime.instance.currentProjectCache.getProject().id,
                id: item.id,
                type: structureType,
            }),
        {
            onError() {
                error('Failed truncating structure', 'Please, try again later.');
                setOpenTruncateModal(false);
            },
            onSuccess() {
                success('Success', 'Item has been successfully truncated.');
                setOpenTruncateModal(false);
            },
        },
    );

    const { isLoading: isRemoveLoading, mutate: remove } = useMutation<unknown, ApiError, void>(
        () =>
            removeStructure({
                projectId: Runtime.instance.currentProjectCache.getProject().id,
                id: item.id,
                type: structureType,
            }),
        {
            onError() {
                error('Failed removing structure', 'Please, try again later.');
                setOpenDeleteModal(false);
            },
            onSuccess() {
                success('Success', 'Item has been successfully removed.');
                setOpenDeleteModal(false);
                onStructureRemoved();
            },
        },
    );

    return (
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        /*
// @ts-ignore */
        <TableRow ref={ref}>
            <Table.Td className={styles.nameRowTitle}>{item.name}</Table.Td>

            <Table.Td>
                {!existsInConfig && <IconCircleX color="var(--mantine-color-red-7)" size={18} />}
                {existsInConfig && <IconCheck color="var(--mantine-color-green-7)" size={18} />}
            </Table.Td>

            <Table.Td className={styles.createdAt}>{appDate(item.createdAt)}</Table.Td>

            <Table.Td className={styles.actionRow}>
                <Tooltip
                    multiline
                    w={!existsInConfig ? 120 : 200}
                    styles={{
                        tooltip: {
                            textAlign: existsInConfig ? 'left' : 'center',
                            backgroundColor: 'white',
                            border: '1px solid var(--mantine-color-gray-2)',
                            color: 'var(--mantine-color-gray-9)',
                            lineHeight: '1.4rem',
                        },
                    }}
                    label={tooltipTruncateContent}>
                    <ActionIcon
                        variant="filled"
                        loading={isTruncateLoading}
                        loaderProps={{
                            color: 'var(--mantine-color-red-9)',
                        }}
                        disabled={existsInConfig}
                        classNames={{
                            root: rootClassName,
                        }}
                        radius="xl"
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();

                            if (!existsInConfig) {
                                setOpenTruncateModal(true);
                            }
                        }}>
                        <IconEraser color={iconColor} size={16} />
                    </ActionIcon>
                </Tooltip>

                <Tooltip
                    multiline
                    w={!existsInConfig ? 120 : 200}
                    styles={{
                        tooltip: {
                            textAlign: existsInConfig ? 'left' : 'center',
                            backgroundColor: 'white',
                            border: '1px solid var(--mantine-color-gray-2)',
                            color: 'var(--mantine-color-gray-9)',
                            lineHeight: '1.4rem',
                        },
                    }}
                    label={tooltipRemoveContent}>
                    <ActionIcon
                        loaderProps={{
                            color: 'var(--mantine-color-red-9)',
                        }}
                        loading={isRemoveLoading}
                        disabled={existsInConfig}
                        variant="filled"
                        classNames={{
                            root: rootClassName,
                        }}
                        radius="xl"
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();

                            if (!existsInConfig) {
                                setOpenDeleteModal(true);
                            }
                        }}>
                        <IconTrash color={iconColor} size={16} />
                    </ActionIcon>
                </Tooltip>
            </Table.Td>

            <TruncateModal
                structureName={item.name}
                open={openTruncateModal}
                onClose={() => setOpenTruncateModal(false)}
                onConfirm={() => {
                    truncate();
                }}
            />

            <RemoveModal
                structureName={item.name}
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={() => {
                    remove();
                }}
            />
        </TableRow>
    );
}

export const Item = memo(GridItem);
