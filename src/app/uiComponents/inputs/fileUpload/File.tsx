import React, { useCallback, useRef, useState } from 'react';
import type { InputFileFieldProps } from '@app/uiComponents/form/BaseForm';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from '@app/uiComponents/inputs/fileUpload/css/file.module.css';
import Copy from '@app/components/Copy';
import { IconFileText, IconFileTypePdf, IconX } from '@tabler/icons-react';

interface Props {
    inputFile: (props: InputFileFieldProps) => React.ReactNode;
    name: string;
    label?: string;
    description?: string;
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

export function File({ inputFile, name, label, description, validation }: Props) {
    const [file, setFile] = useState('');
    const [fileName, setFileName] = useState('');
    const [type, setType] = useState('');
    const clearUploadedRef = useRef<(() => void) | null>(null);

    const isImage = useCallback(
        (type: string) => {
            if (!type) return;

            const validImages = [
                'image/webp',
                'image/avif',
                'image/jpg',
                'image/jpeg',
                'image/svg',
                'image/png',
                'image/gif',
            ];
            return validImages.includes(type);
        },
        [type],
    );

    const isVideo = useCallback(
        (type: string) => {
            if (!type) return;

            return type.includes('video');
        },
        [type],
    );

    const isPdf = useCallback(
        (type: string) => {
            if (!type) return;

            return type.includes('pdf');
        },
        [type],
    );

    const isOther = useCallback(
        (type: string) => {
            if (!type) return;

            console.log(isPdf(type), isVideo(type), isImage(type));
            return !isPdf(type) && !isVideo(type) && !isImage(type);
        },
        [type],
    );

    return (
        <div className={css.root}>
            {label && <label className={css.label}>{label}</label>}
            {description && <p className={css.description}>{description}</p>}
            <div className={css.main}>
                {fileName && (
                    <div className={css.fileName}>
                        <p className={css.clippedName}>
                            {fileName && fileName.length > 30 ? `${fileName.substring(0, 30)}...` : fileName}

                            <Copy
                                onClick={() => {
                                    navigator.clipboard.writeText(fileName);
                                }}
                            />
                        </p>

                        <IconX
                            onClick={() => {
                                clearUploadedRef.current?.();
                                setFileName('');
                                setFile('');
                                setType('');
                            }}
                            size={16}
                            className={css.clearIcon}
                        />
                    </div>
                )}

                <div className={css.uploadSection}>
                    {isImage(type) && <img src={file} className={css.image} alt="" />}
                    {isVideo(type) && <video controls src={file} className={css.image} />}
                    {isPdf(type) && <IconFileTypePdf size={64} className={css.pdf} />}
                    {isOther(type) && <IconFileText size={64} className={css.pdf} />}

                    {inputFile({
                        name: name,
                        showFileName: false,
                        validation: validation,
                        buttonText: 'Upload from computer',
                        onUploaded(base64: string, name: string, size: number, type: string, clearUploaded) {
                            setFile(base64);
                            setFileName(name);
                            setType(type);
                            clearUploadedRef.current = clearUploaded;
                        },
                    })}
                </div>
            </div>
        </div>
    );
}
