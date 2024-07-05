import React, { useCallback, useRef, useState } from 'react';
import type { InputImageFieldProps } from '@app/uiComponents/form/BaseForm';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from '@app/uiComponents/inputs/fileUpload/css/file.module.css';
import Copy from '@app/components/Copy';
import { IconCloudDownload, IconFiles, IconX } from '@tabler/icons-react';

interface Props {
    inputImage: (props: InputImageFieldProps) => React.ReactNode;
    name: string;
}

function isImage(fileName: string): boolean {
    const validImages = ['webp', 'avif', 'jpg', 'jpeg', 'svg', 'png'];
    const lastPart = fileName.split('.')[fileName.length - 1];

    console.log(lastPart);
    return validImages.includes(lastPart);
}

export function File({ inputImage, name }: Props) {
    const [file, setFile] = useState('');
    const [fileName, setFileName] = useState('');
    const [size, setSize] = useState<number | undefined>(undefined);
    const clearUploadedRef = useRef<(() => void) | null>(null);

    const isImage = useCallback(
        (fileName: string) => {
            if (!fileName) return;

            const validImages = ['webp', 'avif', 'jpg', 'jpeg', 'svg', 'png'];
            const parts = fileName.split('.');

            return validImages.includes(parts[parts.length - 1]);
        },
        [fileName],
    );

    return (
        <div className={css.root}>
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
                            setSize(undefined);
                            setFile('');
                        }}
                        size={16}
                        className={css.clearIcon}
                    />
                </div>
            )}

            <div className={css.uploadSection}>
                {!fileName && (
                    <>
                        <div className={css.dropSection}>
                            <span>Drag & Drop</span>
                            <IconCloudDownload className={css.dragDropIcon} />
                        </div>

                        <p>- or -</p>
                    </>
                )}

                {isImage(fileName) && <img src={file} className={css.image} />}

                {inputImage({
                    name: name,
                    showFileName: false,
                    allowedDimensions: {
                        width: 1800,
                        height: 1800,
                    },
                    buttonText: 'Upload from computer',
                    onUploaded(base64: string, name: string, size: number, clearUploaded) {
                        setFile(base64);
                        setFileName(name);
                        setSize(size);
                        clearUploadedRef.current = clearUploaded;
                    },
                })}
            </div>
        </div>
    );
}
