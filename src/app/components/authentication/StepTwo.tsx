// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from '@app/components/authentication/css/stepTwo.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import shared from '@app/components/authentication/css/shared.module.css';
import type { FieldErrors } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, TextInput } from '@mantine/core';
import classNames from 'classnames';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import createAdmin from '@lib/api/auth/createAdmin';
import type { AdminUserCreate } from '@root/types/api/auth';
import UIError from '@app/components/UIError';
import { getFirstError } from '@app/components/authentication/getFirstError';

interface Props {
    onContinue: () => void;
}

export function StepTwo({ onContinue }: Props) {
    const methods = useForm();

    const {
        isLoading,
        error: createAdminError,
        isSuccess,
        mutate,
    } = useMutation<unknown, ApiError, AdminUserCreate>((data) => createAdmin(data));

    const {
        handleSubmit,
        register,
        formState: { errors },
        getValues,
    } = methods;

    useEffect(() => {
        if (isSuccess) onContinue();
    }, [isSuccess]);

    return (
        <div className={classNames(shared.root)}>
            <FormProvider {...methods}>
                <form
                    className={shared.form}
                    onSubmit={handleSubmit((data) => {
                        mutate({
                            name: data.name,
                            lastName: data.lastName,
                            password: data.password,
                            email: data.email,
                        });
                    })}>
                    <TextInput
                        error={getFirstError(errors, 'name')}
                        {...register('name', {
                            required: 'Name is required',
                        })}
                        label="Name"
                    />

                    <TextInput
                        error={getFirstError(errors, 'lastName')}
                        {...register('lastName', {
                            required: 'Last name is required',
                        })}
                        label="Last name"
                    />

                    <TextInput
                        error={getFirstError(errors, 'email')}
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: 'Provided email is invalid',
                            },
                        })}
                        label="Email"
                    />

                    <TextInput
                        error={getFirstError(errors, 'password')}
                        {...register('password', {
                            required: 'Password is required',
                        })}
                        type="password"
                        label="Password"
                    />

                    <TextInput
                        error={getFirstError(errors, 'repeatPassword')}
                        {...register('repeatPassword', {
                            required: 'Passwords are not equal',
                            validate: () =>
                                getValues('password') !== getValues('repeatPassword')
                                    ? 'Password must be the same'
                                    : undefined,
                        })}
                        type="password"
                        label="Repeat password"
                    />

                    {createAdminError && <UIError title="Cannot create admin user" />}

                    <div className={shared.button}>
                        <Button loading={isLoading} type="submit">
                            Create
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
