import React, { useCallback, useRef, useState } from 'react';
import type { InputFileFieldProps } from '@app/uiComponents/form/BaseForm';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from '@app/uiComponents/inputs/fileUpload/css/file.module.css';
import Copy from '@app/components/Copy';
import { IconFileText, IconFileTypePdf, IconX } from '@tabler/icons-react';
import type { ButtonProps, FileButtonProps } from '@mantine/core';
import type { Attachment } from '@root/types/forms/forms';
import { Grid } from '@app/layouts/Grid';
import { Cell } from '@app/layouts/Cell';
import classNames from 'classnames';

interface Props {
    inputFile: (props: InputFileFieldProps) => React.ReactNode;
    name: string;
    label?: string;
    description?: string;
    fileButtonProps?: FileButtonProps;
    buttonProps?: ButtonProps;
    validation?: {
        allowedSize?: {
            size: number;
            message?: string;
        };
        allowedDimensions?: {
            width: number;
            height: number;
            message?: string;
        };
        required?: {
            value: boolean;
            message?: string;
        };
        maxFiles?: number;
    };
}

export function File({ inputFile, name, label, description, validation, fileButtonProps, buttonProps }: Props) {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [clear, setClear] = useState(false);

    const isImage = useCallback((type: string) => {
        if (!type) return;

        const validImages = [
            'image/webp',
            'image/avif',
            'image/jpg',
            'image/jpeg',
            'image/svg+xml',
            'image/svg',
            'image/png',
            'image/gif',
        ];
        return validImages.includes(type);
    }, []);

    const isVideo = useCallback((type: string) => {
        if (!type) return;

        return type.includes('video') || type.includes('octet-stream');
    }, []);

    const isPdf = useCallback((type: string) => {
        if (!type) return;

        return type.includes('pdf');
    }, []);

    const isOther = useCallback((type: string) => {
        if (!type) return;

        return !isPdf(type) && !isVideo(type) && !isImage(type);
    }, []);

    return (
        <div className={css.root}>
            {label && <label className={css.label}>{label}</label>}
            {description && <p className={css.description}>{description}</p>}
            <div className={css.main}>
                <section className={css.uploadSection}>
                    {attachments.length !== 0 && (
                        <div className={css.clearUploaded}>
                            <IconX
                                onClick={() => {
                                    setAttachments([]);
                                    setClear(true);
                                }}
                                size={16}
                                className={css.clearIcon}
                            />
                        </div>
                    )}

                    <Grid gap="24px">
                        {attachments.map((item, i) => (
                            <Cell
                                span={attachments.length === 1 ? 'span 12' : 'span 4'}
                                cls={[css.fileGridColumn]}
                                key={i}>
                                {isImage(item.type) && (
                                    <img src={item.base64} className={classNames(css.baseFileItem, css.image)} alt="" />
                                )}

                                {isVideo(item.type) && (
                                    <video
                                        controls
                                        src={item.base64}
                                        className={classNames(css.baseFileItem, css.image)}
                                    />
                                )}

                                {isPdf(item.type) && (
                                    <IconFileTypePdf size={64} className={classNames(css.baseFileItem, css.pdf)} />
                                )}

                                {isOther(item.type) && (
                                    <IconFileText size={64} className={classNames(css.baseFileItem, css.pdf)} />
                                )}
                            </Cell>
                        ))}
                    </Grid>

                    {inputFile({
                        name: name,
                        showFileName: false,
                        clear: clear,
                        onCleared: () => {
                            setClear(false);
                        },
                        validation: validation,
                        buttonText: 'Upload from computer',
                        fileButtonProps: fileButtonProps,
                        buttonProps: buttonProps,
                        onUploaded(attachments: Attachment[]) {
                            setAttachments(attachments);
                        },
                    })}
                </section>
            </div>
        </div>
    );
}
