// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/css/authentication/wrapper.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from '@app/components/authentication/css/login.module.css';
import type { FieldErrors } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, TextInput } from '@mantine/core';

function getFirstError(errors: FieldErrors, field: string) {
    const fieldError = errors[field];
    if (!fieldError) return undefined;

    if (fieldError.message && typeof fieldError?.message === 'string') {
        return fieldError.message;
    }

    return 'This field is invalid.';
}

export function Login() {
    const methods = useForm();

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = methods;

    return (
        <div className={styles.root}>
            <div className={styles.centerRoot}>
                <div className={css.root}>
                    <FormProvider {...methods}>
                        <form className={css.form} onSubmit={handleSubmit(console.log)}>
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

                            <div className={css.button}>
                                <Button type="submit">Login</Button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    );
}
