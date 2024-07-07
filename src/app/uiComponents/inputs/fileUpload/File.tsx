import React, { useCallback, useRef, useState } from 'react';
import type { InputFileFieldProps } from '@app/uiComponents/form/BaseForm';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from '@app/uiComponents/inputs/fileUpload/css/file.module.css';
import Copy from '@app/components/Copy';
import { IconX } from '@tabler/icons-react';

interface Props {
    inputFile: (props: InputFileFieldProps) => React.ReactNode;
    name: string;
    label?: string;
    description?: string;
}

export function File({ inputFile, name, label, description }: Props) {
    const [file, setFile] = useState('');
    const [fileName, setFileName] = useState('');
    const clearUploadedRef = useRef<(() => void) | null>(null);

    const isImage = useCallback(
        (fileName: string) => {
            if (!fileName) return;

            const validImages = ['webp', 'avif', 'jpg', 'jpeg', 'svg', 'png', 'gif'];
            const parts = fileName.split('.');

            return validImages.includes(parts[parts.length - 1]);
        },
        [fileName],
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
                            }}
                            size={16}
                            className={css.clearIcon}
                        />
                    </div>
                )}

                <div className={css.uploadSection}>
                    {isImage(fileName) && <img src={file} className={css.image} />}

                    {inputFile({
                        name: name,
                        showFileName: false,
                        buttonText: 'Upload from computer',
                        onUploaded(base64: string, name: string, size: number, clearUploaded) {
                            setFile(base64);
                            setFileName(name);
                            clearUploadedRef.current = clearUploaded;
                        },
                    })}
                </div>
            </div>
        </div>
    );
}
