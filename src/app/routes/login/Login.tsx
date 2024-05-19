// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/css/authentication/wrapper.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import shared from '@app/components/authentication/css/shared.module.css';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, TextInput } from '@mantine/core';
import { getFirstError } from '@app/components/authentication/getFirstError';
import { useAuthRedirect } from '@app/components/authentication/useAuthRedirect';
import { useMutation } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import type { LoginBlueprint } from '@root/types/api/auth';
import login from '@lib/api/auth/login';
import { useEffect } from 'react';
import UIError from '@app/components/UIError';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const safeToShow = useAuthRedirect('/', (isFetching, exists) => !isFetching && !exists);
    const navigate = useNavigate();

    const {
        isLoading: isLoginLoading,
        error: loginError,
        isSuccess: isLoginSuccess,
        mutate: mutateLogin,
    } = useMutation<unknown, ApiError, LoginBlueprint>((data) => login(data));

    useEffect(() => {
        if (isLoginSuccess) {
            navigate('/setup');
        }
    }, [isLoginSuccess]);

    const methods = useForm();
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = methods;

    return (
        <>
            {safeToShow && (
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
                                        error={getFirstError(errors, 'email')}
                                        {...register('email', {
                                            required: 'Email is required',
                                        })}
                                        label="Email"
                                    />
                                    <TextInput
                                        type="password"
                                        error={getFirstError(errors, 'password')}
                                        {...register('password', {
                                            required: 'Password is required',
                                        })}
                                        label="Password"
                                    />

                                    {loginError && <UIError title="Cannot login at this moment" />}

                                    <div className={shared.button}>
                                        <Button loading={isLoginLoading} type="submit">
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
