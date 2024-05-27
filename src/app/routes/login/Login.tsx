// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/css/authentication/wrapper.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import shared from '@app/components/authentication/css/shared.module.css';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, TextInput } from '@mantine/core';
import { getFirstError } from '@app/components/authentication/getFirstError';
import { useMutation, useQuery } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import type { LoginBlueprint } from '@root/types/api/auth';
import login from '@lib/api/auth/login';
import React, { useEffect, useRef, useState } from 'react';
import UIError from '@app/components/UIError';
import { useNavigate } from 'react-router-dom';
import type { TryResult } from '@root/types/shared';
import { getProject } from '@lib/api/project/getProject';
import type { CreatifApp } from '@root/types/shell/shell';
import type { Project } from '@root/types/api/project';
import createProject from '@lib/api/project/createProject';
import adminExists from '@lib/api/auth/adminExists';
import { validateConfig } from '@app/setupUtil';
import { ValidationMessages } from '@app/uiComponents/configValidation/ValidationMessages';

interface Props {
    config: CreatifApp;
}

export function Login({ config }: Props) {
    const [enableProjectExistsCheck, setEnableProjectExistsCheck] = useState(false);
    const [createProjectError, setCreateProjectError] = useState(false);
    const navigate = useNavigate();
    const adminCheckRef = useRef(false);
    const [validationMessages, setValidationMessages] = useState<string[] | null>(null);

    useEffect(() => {
        const messages = validateConfig(config);

        if (messages.length !== 0) {
            setValidationMessages(messages);
            return;
        }

        setValidationMessages(null);
    }, [config]);

    const {
        isFetching: isAdminExistsFetching,
        data: adminExistsData,
        error: adminExistsError,
    } = useQuery<unknown, ApiError, TryResult<boolean>>('admin_exists', adminExists, {
        refetchOnWindowFocus: false,
        keepPreviousData: false,
        staleTime: -1,
        retry: 3,
    });

    const {
        isFetching,
        data: projectData,
        error: projectError,
    } = useQuery<unknown, ApiError, TryResult<Project>>('get_project', async () => getProject(config.projectName), {
        enabled: enableProjectExistsCheck,
        staleTime: -1,
        retry: -1,
        refetchOnWindowFocus: false,
        keepPreviousData: false,
    });

    const {
        isLoading: isLoginLoading,
        error: loginError,
        isSuccess: isLoginSuccess,
        mutate: mutateLogin,
    } = useMutation<unknown, ApiError, LoginBlueprint>((data) => login(data));

    useEffect(() => {
        if (adminCheckRef.current) return;

        if (!isAdminExistsFetching && adminExistsData && !adminExistsData.result && !adminExistsError) {
            navigate('/');
            return;
        }

        if (!isAdminExistsFetching && adminExistsData) {
            adminCheckRef.current = true;
        }
    }, [isAdminExistsFetching, adminExistsData, adminExistsError]);

    useEffect(() => {
        if (isLoginSuccess) {
            setEnableProjectExistsCheck(true);
        }
    }, [isLoginSuccess]);

    useEffect(() => {
        if (!isLoginSuccess) return;

        if (projectData && projectData.result) {
            location.href = `/dashboard/${projectData.result.id}`;
            return;
        }

        if (projectError && projectError.status === 404) {
            createProject({
                name: config.projectName,
            }).then(({ result, error }) => {
                if (error) {
                    setCreateProjectError(true);
                }

                if (result) {
                    location.href = `/dashboard/${result.id}`;
                }
            });

            return;
        }
    }, [projectData, projectError, isLoginSuccess]);

    const methods = useForm();
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = methods;

    const isProcessing = isLoginLoading || isFetching || isAdminExistsFetching;
    const loginDisabled = Boolean(
        createProjectError || (projectError && projectError.status !== 404) || adminExistsError,
    );

    return (
        <>
            {validationMessages && (
                <div className={styles.root}>
                    <div className={styles.centerRoot}>
                        <div className={shared.root}>
                            <ValidationMessages messages={validationMessages} />
                        </div>
                    </div>
                </div>
            )}
            {!validationMessages && (
                <div className={styles.root}>
                    <div className={styles.centerRoot}>
                        <div className={shared.root}>
                            <FormProvider {...methods}>
                                <form
                                    className={shared.form}
                                    onSubmit={handleSubmit((data) => {
                                        mutateLogin({
                                            email: data.email,
                                            password: data.password,
                                        });
                                    })}>
                                    <TextInput
                                        disabled={loginDisabled}
                                        error={getFirstError(errors, 'email')}
                                        {...register('email', {
                                            required: 'Email is required',
                                        })}
                                        label="Email"
                                    />
                                    <TextInput
                                        disabled={loginDisabled}
                                        type="password"
                                        error={getFirstError(errors, 'password')}
                                        {...register('password', {
                                            required: 'Password is required',
                                        })}
                                        label="Password"
                                    />

                                    {loginDisabled && (
                                        <UIError title="Cannot login at this moment. Please, try again later." />
                                    )}
                                    {loginError && <UIError title="Username or email are invalid." />}

                                    <div className={shared.button}>
                                        <Button disabled={loginDisabled} loading={isProcessing} type="submit">
                                            Login
                                        </Button>
                                    </div>
                                </form>
                            </FormProvider>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
