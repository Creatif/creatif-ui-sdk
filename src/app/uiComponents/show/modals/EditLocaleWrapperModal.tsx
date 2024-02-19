import EditLocaleModal from '@app/uiComponents/shared/modals/EditLocaleModal';
import React, { useEffect } from 'react';
import useUpdateVariable from '@app/uiComponents/lists/hooks/useUpdateVariable';
import type { StructureItem } from '@app/systems/stores/projectMetadataStore';

interface Props {
    isOpen: boolean;
    structureItem: StructureItem;

    id: string;
    name: string;
    currentLocale: string;

    onClose: () => void;
    onUpdated: (locale: string) => void;
}

export function EditLocaleWrapperModal({ isOpen, structureItem, id, name, currentLocale, onClose, onUpdated }: Props) {
    const { mutate, data: updatedVariable } = useUpdateVariable(
        structureItem?.structureType || '',
        structureItem.id || '',
        id,
        name,
    );

    useEffect(() => {
        if (updatedVariable?.result) {
            onUpdated(updatedVariable.result.locale);
        }
    }, [updatedVariable]);

    return (
        <EditLocaleModal
            currentLocale={currentLocale}
            open={isOpen}
            onClose={onClose}
            onEdit={(locale) => {
                if (currentLocale === locale) {
                    onClose();
                    return;
                }

                mutate({
                    values: {
                        locale: locale,
                    },
                    fields: ['locale'],
                });

                onClose();
            }}
        />
    );
}
