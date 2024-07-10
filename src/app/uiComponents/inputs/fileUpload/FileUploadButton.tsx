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
import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import { getDimensions } from '@app/uiComponents/inputs/fileUpload/getDimensions';
import type { AllowedFileDimensions, Attachment, ProcessedResult } from '@root/types/forms/forms';

interface Props {
    name: string;
    showFileName?: boolean;
    clear?: boolean;
    onCleared?: () => void;
    store: ImagePathsStore;
    fileButtonProps?: FileButtonProps;
    buttonProps?: ButtonProps;
    buttonText?: string;
    globalLoadingStore: GlobalLoadingStore;
    validation?: {
        allowedSize?: {
            size: number;
            message?: string;
        };
        allowedDimensions?: AllowedFileDimensions;
        required?: {
            value: boolean;
            message?: string;
        };
    };
    onUploaded?: (attachments: Attachment[]) => void;
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
    validation,
    clear = false,
    onCleared,
}: Props) {
    const { setValue, getValues, control } = useFormContext();
    const [isCreatingBase64, setIsCreatingBase64] = useState(false);
    const [currentlyLoadedFile, setCurrentlyLoadedFile] = useState<File | File[] | null>(null);
    const resetRef = useRef<() => void>(null);
    const [filePathError, setFilePathError] = useState<string | undefined>();
    const updateRef = useRef(false);
    const [fileProcessError, setFileProcessError] = useState(false);
    const oldNameRef = useRef<string>(name);
    const [error, setError] = useState('');
    const [internalClear, setInternalClear] = useState(clear);

    const requiredError = useFirstError(name);

    useEffect(() => {
        if (!clear && !internalClear) return;

        if (clear || internalClear) {
            resetRef.current?.();
            const currentlyLoadedValues = getValues(oldNameRef.current);

            if (Array.isArray(currentlyLoadedValues)) {
                setCurrentlyLoadedFile(null);
                setValue(oldNameRef.current, []);
                onCleared?.();

                return;
            }

            setCurrentlyLoadedFile(null);
            setValue(oldNameRef.current, '');
            onCleared?.();
        }
    }, [clear, internalClear, onCleared]);

    const { registerWorker, workerHandler } = useWorker('src/singleUploadWorker', (e) => {
        setIsCreatingBase64(false);
        globalLoadingStore.getState().removeLoader();

        if (e.data.result.error) {
            setFileProcessError(true);
            return;
        }

        if (e.data.isUpdate) {
            const currentUploadedImage: UploadedImage = getValues(name) as UploadedImage;

            onUploaded?.([
                {
                    base64: `data:${currentUploadedImage.mimeType};base64,${e.data.result.result}`,
                    name: currentUploadedImage.path,
                    size: e.data.result.size,
                    type: e.data.result.type,
                },
            ]);

            setValue(
                oldNameRef.current,
                `data:${currentUploadedImage.mimeType}#${currentUploadedImage.extension};base64,${e.data.result.result}`,
            );

            return;
        }

        setValue(oldNameRef.current, e.data.result.result);
        onUploaded?.([
            {
                base64: e.data.result.result.replace(/#.*;/, ';'),
                name: e.data.result.name,
                size: e.data.result.size,
                type: e.data.result.type,
            },
        ]);
    });

    const { registerWorker: registerMultipleUploads, workerHandler: multipleWorkerHandler } = useWorker(
        'src/multipleUploadsWorker',
        (e) => {
            setIsCreatingBase64(false);
            globalLoadingStore.getState().removeLoader();

            if (e.data.result.error) {
                setFileProcessError(true);
                return;
            }

            if (e.data.isUpdate) {
                const currentUploadedImages: UploadedImage[] = getValues(name) as UploadedImage[];

                const results = e.data.result;
                const attachments: Attachment[] = [];
                const base64Only: string[] = [];
                for (const result of results) {
                    const currentlyUploadedImage = currentUploadedImages.find((img) => img.id === result.id);
                    if (currentlyUploadedImage) {
                        base64Only.push(
                            `data:${currentlyUploadedImage.mimeType}#${currentlyUploadedImage.extension};base64,${result.result}`,
                        );

                        attachments.push({
                            base64: `data:${currentlyUploadedImage.mimeType};base64,${result.result}`,
                            name: currentlyUploadedImage.path,
                            size: result.size,
                            type: result.type,
                        });
                    }
                }

                onUploaded?.(attachments);

                setValue(oldNameRef.current, base64Only);

                return;
            }

            const base64Only = e.data.result.map((item: ProcessedResult) => item.result);
            setValue(oldNameRef.current, base64Only);
            const attachments: Attachment[] = e.data.result.map((item: ProcessedResult) => ({
                base64: item.result.replace(/#.*;/, ';'),
                name: item.name,
                size: item.size,
                type: item.type,
            }));

            onUploaded?.(attachments);
        },
    );

    const onDestroy = useCallback(() => {
        store.getState().removePath(oldNameRef.current);
    }, [name]);

    const handleAlreadyUploadedImage = useCallback(() => {
        const currentValue: UploadedImage[] | UploadedImage = getValues(name) as UploadedImage | UploadedImage[];
        if (currentValue && !Array.isArray(currentValue)) {
            globalLoadingStore.getState().addLoader();
            setIsCreatingBase64(true);
            updateRef.current = true;

            workerHandler.postMessage(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                `${import.meta.env.VITE_API_HOST}/api/v1/files/file/${
                    Runtime.instance.currentProjectCache.getProject().id
                }/${currentValue.id}`,
            );
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setCurrentlyLoadedFile(currentValue.id);
        }

        if (currentValue && Array.isArray(currentValue)) {
            globalLoadingStore.getState().addLoader();
            setIsCreatingBase64(true);
            updateRef.current = true;

            const urls: { id: string; url: string }[] = [];
            for (const val of currentValue) {
                urls.push({
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    url: `${import.meta.env.VITE_API_HOST}/api/v1/files/file/${
                        Runtime.instance.currentProjectCache.getProject().id
                    }/${val.id}`,
                    id: val.id,
                });
            }

            multipleWorkerHandler.postMessage(urls);
        }
    }, []);

    const validateSize = useCallback(
        (file: File) => {
            const allowedSize = validation?.allowedSize;

            if (allowedSize && file.size > allowedSize.size) {
                globalLoadingStore.getState().removeLoader();

                setError(
                    allowedSize.message
                        ? allowedSize.message
                        : `Image size is bigger than allowed size of ${allowedSize.size} bytes`,
                );
                return;
            }
        },
        [validation],
    );

    const validateDimensions = useCallback(
        async (allowedDimensions: AllowedFileDimensions, file: File) => {
            const result = await getDimensions(URL.createObjectURL(file));
            const { dimensions, error } = result;

            if (error && error === 'aborted') {
                globalLoadingStore.getState().removeLoader();
                return;
            }

            if (error) {
                globalLoadingStore.getState().removeLoader();
                setError(error);
                return false;
            }

            if (
                (dimensions && dimensions.width > allowedDimensions.width) ||
                (dimensions && dimensions.height > allowedDimensions.height)
            ) {
                setError(
                    allowedDimensions.message
                        ? allowedDimensions.message
                        : `Image width or height is invalid. Uploaded image can have width up to ${allowedDimensions.width}px and height up to ${allowedDimensions.height}px`,
                );
                globalLoadingStore.getState().removeLoader();

                return false;
            }

            return true;
        },
        [validation],
    );

    const validateMultiple = useCallback(async (files: File[]) => {
        for (const f of files) {
            validateSize(f);
            if (validation?.allowedDimensions) {
                const valid = await validateDimensions(validation.allowedDimensions, f);
                if (!valid) return valid;
            }
        }

        return true;
    }, []);

    useEffect(() => {
        registerWorker();
        registerMultipleUploads();

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
                rules={{
                    validate: (value) => {
                        if (validation?.required && validation.required.value) {
                            if (!value)
                                return validation.required.message
                                    ? validation.required.message
                                    : `${name} is required.`;
                        }

                        return undefined;
                    },
                }}
                control={control}
                render={({ field: { onChange } }) => (
                    <FileButton
                        {...fileButtonProps}
                        resetRef={resetRef}
                        name={name}
                        onChange={(file: File | File[] | null) => {
                            if (!file) {
                                onChange(undefined);
                                store.getState().removePath(name);
                                return;
                            }

                            setError('');
                            globalLoadingStore.getState().addLoader();
                            let isSingleFileUpload = false;
                            let tempFiles: File[] = [];
                            if (!Array.isArray(file)) {
                                tempFiles = [file];
                                isSingleFileUpload = true;
                            } else {
                                tempFiles = file;
                            }

                            validateMultiple(tempFiles).then((valid) => {
                                if (!valid) return;

                                setCurrentlyLoadedFile(isSingleFileUpload ? tempFiles[0] : tempFiles);
                                setIsCreatingBase64(true);

                                if (isSingleFileUpload) {
                                    workerHandler.postMessage(tempFiles[0]);
                                    return;
                                }

                                multipleWorkerHandler.postMessage(tempFiles);
                            });

                            return;
                        }}>
                        {(props) => (
                            <>
                                {currentlyLoadedFile && showFileName && (
                                    <div className={css.loadedFileText}>
                                        <IconX
                                            size={16}
                                            onClick={() => {
                                                setInternalClear(true);
                                            }}
                                            className={css.clearIcon}
                                        />
                                        {!Array.isArray(currentlyLoadedFile) && (
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
                                        )}

                                        {Array.isArray(currentlyLoadedFile) &&
                                            currentlyLoadedFile.map((file, i) => (
                                                <p key={i} className={css.clippedLoadedContent}>
                                                    {file.name.length > 30
                                                        ? `${file.name.substring(0, 30)}...`
                                                        : file.name}

                                                    <Copy
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(file?.name);
                                                        }}
                                                    />
                                                </p>
                                            ))}
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

            {requiredError && (
                <span
                    style={{
                        fontSize: '13px',
                        color: 'var(--mantine-color-red-6)',
                        lineHeight: '1.2rem',
                    }}>
                    {requiredError}
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
