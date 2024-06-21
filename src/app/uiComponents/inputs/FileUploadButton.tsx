import type { ButtonProps, FileButtonProps } from '@mantine/core';
import { Button, FileButton } from '@mantine/core';
import type { ImagePathsStore } from '@app/systems/stores/imagePaths';
import type { RegisterOptions } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';
import { useCallback, useEffect, useRef, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from '@app/uiComponents/inputs/css/fileButton.module.css';
import { IconX } from '@tabler/icons-react';

interface Props {
    name: string;
    store: ImagePathsStore;
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    fileButtonProps?: FileButtonProps;
    buttonProps?: ButtonProps;
    buttonText?: string;
    onUploaded?: (file: File | null) => void;
}

export function FileUploadButton({
    name,
    fileButtonProps,
    buttonProps,
    onUploaded,
    store,
    buttonText = 'Upload file',
}: Props) {
    const { setValue } = useFormContext();
    const [isCreatingBase64, setIsCreatingBase64] = useState(false);
    const [currentlyLoadedFile, setCurrentlyLoadedFile] = useState<string | null>(null);
    const resetRef = useRef<() => void>(null);
    const uploadWorkerRef = useRef<Worker | null>(null);

    useEffect(() => {
        uploadWorkerRef.current = new Worker(new URL('http://localhost:5173/uploadWorker'), { type: 'module' });

        uploadWorkerRef.current.onmessage = (e) => {
            setValue(name, e.data);
            setIsCreatingBase64(false);
            store.getState().addPath(name);
        };
    }, []);

    useEffect(() => () => store.getState().removePath(name), []);

    const createBase64Image = useCallback((file: File | null): Promise<string | undefined> => {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(undefined);
                return;
            }

            const reader = new FileReader();
            reader.readAsArrayBuffer(file);

            reader.onloadend = async () => {
                const arr = new Uint8Array(reader.result as ArrayBuffer);
                const str = arr.reduce((data, byte) => data + String.fromCharCode(byte), '');

                const split = file.name.split('.');
                let data = `data:${file.type}`;
                if (split.length > 1) {
                    data = `data:${file.type}#${split[split.length - 1]}`;
                }

                const base64 = btoa(str);
                resolve(`${data};base64,${base64}`);
            };
        });
    }, []);

    return (
        <Controller
            name={name}
            render={({ field: { onChange } }) => (
                <FileButton
                    {...fileButtonProps}
                    resetRef={resetRef}
                    name={name}
                    onChange={(file) => {
                        if (!file) {
                            onChange(undefined);
                            onUploaded?.(null);
                            store.getState().removePath(name);
                            return;
                        }

                        setCurrentlyLoadedFile(file.name);
                        setIsCreatingBase64(true);
                        uploadWorkerRef.current?.postMessage(file);
                    }}>
                    {(props) => (
                        <>
                            {currentlyLoadedFile && (
                                <p className={css.loadedFileText}>
                                    <IconX
                                        size={16}
                                        onClick={() => {
                                            setCurrentlyLoadedFile(null);
                                            resetRef.current?.();
                                            store.getState().removePath(name);
                                        }}
                                        className={css.clearIcon}
                                    />
                                    {currentlyLoadedFile}
                                </p>
                            )}
                            <Button loading={isCreatingBase64} {...{ ...props, ...buttonProps }}>
                                {buttonText}
                            </Button>
                        </>
                    )}
                </FileButton>
            )}
        />
    );
}
