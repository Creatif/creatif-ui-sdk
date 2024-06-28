import type { ButtonProps, FileButtonProps } from '@mantine/core';
import { Button, FileButton } from '@mantine/core';
import type { ImagePathsStore } from '@app/systems/stores/imagePaths';
import type { RegisterOptions } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from '@app/uiComponents/inputs/css/fileButton.module.css';
import { IconX } from '@tabler/icons-react';
import RuntimeErrorModal from '@app/uiComponents/shared/RuntimeErrorModal';
import Copy from '@app/components/Copy';
import type { UploadedImage } from '@root/types/api/images';
import { Runtime } from '@app/systems/runtime/Runtime';
import UIError from '@app/components/UIError';
import type { GlobalLoadingStore } from '@app/systems/stores/globalLoading';

interface Props {
    name: string;
    store: ImagePathsStore;
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    fileButtonProps?: FileButtonProps;
    buttonProps?: ButtonProps;
    buttonText?: string;
    globalLoadingStore: GlobalLoadingStore;
    onUploaded?: (base64: string) => void;
}

export function FileUploadButton({
    name,
    fileButtonProps,
    buttonProps,
    globalLoadingStore,
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
    const updateRef = useRef(false);
    const [fileProcessError, setFileProcessError] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        uploadWorkerRef.current = new Worker(new URL(`${import.meta.env.VITE_FRONTEND_HOST}/uploadWorker`), {
            type: 'module',
        });

        uploadWorkerRef.current.onmessage = (e) => {
            setIsCreatingBase64(false);
            globalLoadingStore.getState().removeLoader();

            if (e.data.result.error) {
                setFileProcessError(true);
                return;
            }

            if (e.data.isUpdate) {
                const currentUploadedImage: UploadedImage = getValues(name) as UploadedImage;
                onUploaded?.(`data:${currentUploadedImage.mimeType};base64,${e.data.result.result}`);
                setValue(name, e.data.result.result);

                return;
            }

            setValue(name, e.data.result.result);
            onUploaded?.(e.data.result.result.replace(/#.*;/, ';'));
        };

        const currentValue: UploadedImage = getValues(name) as UploadedImage;
        if (currentValue) {
            globalLoadingStore.getState().addLoader();
            // mark that this is in a update form
            updateRef.current = true;
            setIsCreatingBase64(true);
            uploadWorkerRef.current?.postMessage(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                `${import.meta.env.VITE_API_HOST}/api/v1/images/image/${
                    Runtime.instance.currentProjectCache.getProject().id
                }/${currentValue.id}`,
            );
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setCurrentlyLoadedFile(currentValue.id);
        }
    }, []);

    useEffect(() => {
        const error = store.getState().addPath(name);
        if (error) {
            setFilePathError(error);
        }
    }, [name]);

    useEffect(() => () => store.getState().removePath(name), []);

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

            {fileProcessError && <UIError title="You file could no be processed" />}

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
