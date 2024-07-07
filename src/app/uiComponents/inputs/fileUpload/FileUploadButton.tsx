import type { ButtonProps, FileButtonProps } from '@mantine/core';
import { Button, FileButton } from '@mantine/core';
import type { ImagePathsStore } from '@app/systems/stores/imagePaths';
import { Controller, useFormContext } from 'react-hook-form';
import { useCallback, useEffect, useRef, useState } from 'react';
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
import { useWorker } from '@app/uiComponents/inputs/fileUpload/useWorker';

interface Props {
    name: string;
    showFileName?: boolean;
    store: ImagePathsStore;
    fileButtonProps?: FileButtonProps;
    buttonProps?: ButtonProps;
    buttonText?: string;
    globalLoadingStore: GlobalLoadingStore;
    allowedSize?: {
        size: number;
        message?: string;
    };
    allowedDimensions?: {
        width: number;
        height: number;
        message?: string;
    };
    onUploaded?: (base64: string, name: string, size: number, clearUploaded: () => void) => void;
}

export function FileUploadButton({
    name,
    fileButtonProps,
    buttonProps,
    globalLoadingStore,
    onUploaded,
    store,
    buttonText = 'Upload file',
    showFileName = true,
    allowedDimensions,
    allowedSize,
}: Props) {
    const { setValue, getValues, control } = useFormContext();
    const [isCreatingBase64, setIsCreatingBase64] = useState(false);
    const [currentlyLoadedFile, setCurrentlyLoadedFile] = useState<File | null>(null);
    const resetRef = useRef<() => void>(null);
    const [filePathError, setFilePathError] = useState<string | undefined>();
    const updateRef = useRef(false);
    const [fileProcessError, setFileProcessError] = useState(false);
    const oldNameRef = useRef<string>(name);
    const [error, setError] = useState('');

    const onClear = useCallback(() => {
        setCurrentlyLoadedFile(null);
        resetRef.current?.();
        setValue(oldNameRef.current, '');
        store.getState().removePath(name);
    }, [currentlyLoadedFile]);

    const { registerWorker, workerHandler } = useWorker('uploadWorker', (e) => {
        setIsCreatingBase64(false);
        globalLoadingStore.getState().removeLoader();

        if (e.data.result.error) {
            setFileProcessError(true);
            return;
        }

        if (e.data.isUpdate) {
            const currentUploadedImage: UploadedImage = getValues(name) as UploadedImage;
            onUploaded?.(
                `data:${currentUploadedImage.mimeType};base64,${e.data.result.result}`,
                currentUploadedImage.path,
                e.data.result.result.length,
                onClear,
            );

            setValue(
                oldNameRef.current,
                `data:${currentUploadedImage.mimeType}#${currentUploadedImage.extension};base64,${e.data.result.result}`,
            );

            return;
        }

        setValue(oldNameRef.current, e.data.result.result);
        onUploaded?.(e.data.result.result.replace(/#.*;/, ';'), e.data.result.name, e.data.result.size, onClear);
    });

    const onDestroy = useCallback(() => {
        store.getState().removePath(oldNameRef.current);
    }, [name]);

    const handleAlreadyUploadedImage = useCallback(() => {
        const currentValue: UploadedImage = getValues(name) as UploadedImage;
        if (currentValue) {
            globalLoadingStore.getState().addLoader();
            // mark that this is in a update form
            updateRef.current = true;
            setIsCreatingBase64(true);
            workerHandler.postMessage(
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
        registerWorker();

        handleAlreadyUploadedImage();
    }, []);

    useEffect(() => {
        if (oldNameRef.current !== name) {
            store.getState().replacePath(oldNameRef.current, name);
            oldNameRef.current = name;

            return;
        }

        const error = store.getState().addPath(name);
        if (error) {
            setFilePathError(error);
        }
    }, [name]);

    useEffect(() => onDestroy, []);

    return (
        <>
            <Controller
                name={name}
                control={control}
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

                            setError('');
                            globalLoadingStore.getState().addLoader();

                            if (allowedSize && file.size > allowedSize.size) {
                                globalLoadingStore.getState().removeLoader();

                                setError(
                                    allowedSize.message
                                        ? allowedSize.message
                                        : `Image size is bigger than allowed size of ${allowedSize.size} bytes`,
                                );
                                return;
                            }

                            if (allowedDimensions) {
                                const reader = new FileReader();
                                reader.readAsDataURL(file);

                                const img = new Image();
                                const objectURL = URL.createObjectURL(file);
                                img.src = objectURL;
                                img.onload = () => {
                                    const w = img.width;
                                    const h = img.height;

                                    if (w > allowedDimensions.width || h > allowedDimensions.height) {
                                        setError(
                                            allowedDimensions.message
                                                ? allowedDimensions.message
                                                : `Image width or height is invalid. Uploaded image can have width up to ${allowedDimensions.width}px and height up to ${allowedDimensions.height}px`,
                                        );
                                        globalLoadingStore.getState().removeLoader();

                                        return;
                                    }

                                    setCurrentlyLoadedFile(file);
                                    setIsCreatingBase64(true);
                                    workerHandler.postMessage(file);
                                };

                                img.onerror = (e) => {
                                    globalLoadingStore.getState().removeLoader();

                                    if (typeof e === 'string') {
                                        setError(
                                            `This file could not be checked for dimensions. The underlying error is: ${e}`,
                                        );
                                        return;
                                    }

                                    setError('This file could not be checked for dimensions');
                                    return;
                                };

                                img.onabort = () => {
                                    globalLoadingStore.getState().removeLoader();
                                };

                                return;
                            }

                            setCurrentlyLoadedFile(file);
                            setIsCreatingBase64(true);
                            workerHandler.postMessage(file);
                        }}>
                        {(props) => (
                            <>
                                {currentlyLoadedFile && showFileName && (
                                    <div className={css.loadedFileText}>
                                        <IconX size={16} onClick={onClear} className={css.clearIcon} />
                                        <p className={css.clippedLoadedContent}>
                                            {currentlyLoadedFile.name.length > 30
                                                ? `${currentlyLoadedFile.name.substring(0, 30)}...`
                                                : currentlyLoadedFile.name}

                                            <Copy
                                                onClick={() => {
                                                    navigator.clipboard.writeText(currentlyLoadedFile?.name);
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

            {error && (
                <span
                    style={{
                        color: 'var(--mantine-color-red-7)',
                        fontWeight: 600,
                        lineHeight: '1.2rem',
                    }}>
                    {error}
                </span>
            )}

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
