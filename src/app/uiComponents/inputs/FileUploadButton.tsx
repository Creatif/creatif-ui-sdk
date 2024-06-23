import type { ButtonProps, FileButtonProps } from '@mantine/core';
import { Button, CopyButton, FileButton } from '@mantine/core';
import type { ImagePathsStore } from '@app/systems/stores/imagePaths';
import type { RegisterOptions } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';
import { useCallback, useEffect, useRef, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from '@app/uiComponents/inputs/css/fileButton.module.css';
import { IconX } from '@tabler/icons-react';
import RuntimeErrorModal from '@app/uiComponents/shared/RuntimeErrorModal';
import Copy from '@app/components/Copy';

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
    const { setValue, getValues } = useFormContext();
    const [isCreatingBase64, setIsCreatingBase64] = useState(false);
    const [currentlyLoadedFile, setCurrentlyLoadedFile] = useState<string | null>(null);
    const resetRef = useRef<() => void>(null);
    const uploadWorkerRef = useRef<Worker | null>(null);
    const [filePathError, setFilePathError] = useState<string | undefined>();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        uploadWorkerRef.current = new Worker(new URL(`${import.meta.env.VITE_HOST}/uploadWorker`), { type: 'module' });
        uploadWorkerRef.current.onmessage = (e) => {
            setIsCreatingBase64(false);

            if (e.data.isUpdate) {
                setValue(name, e.data.image);
                return;
            } else if (!e.data.isUpdate) {
                const error = store.getState().addUpdatedPath(name);
                if (error) {
                    setFilePathError(error);
                }
            }

            setValue(name, e.data);
        };

        const currentValue = getValues(name);
        if (currentValue) {
            setIsCreatingBase64(true);
            uploadWorkerRef.current?.postMessage(currentValue);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setCurrentlyLoadedFile(`${import.meta.env.VITE_HOST}${currentValue}`);
        }
    }, []);

    useEffect(() => {
        const error = store.getState().addPath(name);
        if (error) {
            setFilePathError(error);
        }
    }, [name]);

    useEffect(() => () => store.getState().removePath(name), []);

    const createBase64Image = useCallback(
        (file: File | null): Promise<string | undefined> =>
            new Promise((resolve, reject) => {
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
            }),
        [],
    );

    return (
        <>
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
                                    <div className={css.loadedFileText}>
                                        <IconX
                                            size={16}
                                            onClick={() => {
                                                setCurrentlyLoadedFile(null);
                                                resetRef.current?.();
                                                setValue(name, '');
                                                store.getState().removePath(name);
                                            }}
                                            className={css.clearIcon}
                                        />
                                        <p className={css.clippedLoadedContent}>
                                            {currentlyLoadedFile.length > 30
                                                ? `${currentlyLoadedFile.substring(0, 30)}...`
                                                : currentlyLoadedFile}

                                            <Copy
                                                onClick={() => {
                                                    navigator.clipboard.writeText(currentlyLoadedFile);
                                                }}
                                            />
                                        </p>
                                    </div>
                                )}
                                <Button loading={isCreatingBase64} {...{ ...props, ...buttonProps }}>
                                    {buttonText}
                                </Button>
                            </>
                        )}
                    </FileButton>
                )}
            />

            {filePathError && (
                <RuntimeErrorModal
                    open={true}
                    error={{
                        message: `'name' attribute '${name}' already exists. An image 'name' attribute must be unique.
                        This error requires a refresh.`,
                    }}
                />
            )}
        </>
    );
}
