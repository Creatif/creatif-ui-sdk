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

export function Login() {
    const safeToShow = useAuthRedirect('/', (isFetching, exists) => !isFetching && !exists);

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
                                <form className={shared.form} onSubmit={handleSubmit(console.log)}>
                                    <TextInput
                                        error={getFirstError(errors, 'email')}
                                        {...register('email', {
                                            required: 'Email is required',
                                        })}
                                        label="Email"
                                    />
                                    <TextInput
                                        error={getFirstError(errors, 'password')}
                                        {...register('password', {
                                            required: 'Password is required',
                                        })}
                                        label="Password"
                                    />

                                    <div className={shared.button}>
                                        <Button type="submit">Login</Button>
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
