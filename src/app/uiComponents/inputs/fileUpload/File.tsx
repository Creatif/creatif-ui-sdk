import React, { useCallback, useRef, useState } from 'react';
import type { InputFileFieldProps } from '@app/uiComponents/form/BaseForm';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from '@app/uiComponents/inputs/fileUpload/css/file.module.css';
import Copy from '@app/components/Copy';
import { IconFileText, IconFileTypePdf, IconX } from '@tabler/icons-react';
import type { ButtonProps, FileButtonProps } from '@mantine/core';
import type { Attachment } from '@root/types/forms/forms';

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

                    {attachments.map((item, i) => (
                        <div className={css.fileColumn} key={i}>
                            <div className={css.fileName}>
                                <p className={css.clippedName}>
                                    {item.name && item.name.length > 30
                                        ? `${item.name.substring(0, 30)}...`
                                        : item.name}

                                    <Copy
                                        onClick={() => {
                                            navigator.clipboard.writeText(item.name);
                                        }}
                                    />
                                </p>
                            </div>
                            {isImage(item.type) && <img src={item.base64} className={css.image} alt="" />}
                            {isVideo(item.type) && <video controls src={item.base64} className={css.image} />}
                            {isPdf(item.type) && <IconFileTypePdf size={64} className={css.pdf} />}
                            {isOther(item.type) && <IconFileText size={64} className={css.pdf} />}
                        </div>
                    ))}

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
