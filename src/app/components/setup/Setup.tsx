// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from '@app/components/setup/css/setup.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import shared from '@app/components/authentication/css/shared.module.css';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, TextInput } from '@mantine/core';
import { useMutation, useQuery } from 'react-query';
import hasProjects from '@lib/api/project/hasProject';
import UIError from '@app/components/UIError';
import type { ApiError } from '@lib/http/apiError';
import type { TryResult } from '@root/types/shared';
import Loading from '@app/components/Loading';
import type { CreateProjectBlueprint } from '@root/types/api/project';
import createProject from '@lib/api/project/createProject';
import { useEffect } from 'react';

export function Setup() {
    const {
        isFetching,
        data: projectExistsData,
        error: projectExistsError,
    } = useQuery<unknown, ApiError, TryResult<boolean>>('project_exists', async () => hasProjects(), {
        staleTime: -1,
        retry: 3,
        refetchOnWindowFocus: false,
        keepPreviousData: false,
    });

    const {
        mutate: mutateProject,
        isLoading,
        error: projectCreateError,
        data,
    } = useMutation<unknown, ApiError, CreateProjectBlueprint>((data) => createProject(data));

    useEffect(() => {
        if (data) {
            console.log(data);
        }
    }, [data]);

    const methods = useForm();
    const { handleSubmit, register } = methods;

    return (
        <div className={css.root}>
            <Loading isLoading={isFetching} />
            {!isFetching && !projectExistsData?.result && !projectExistsError && (
                <>
                    <div className={css.header}>
                        <h1>Create your first project</h1>
                        <p>
                            In order to use Creatif, a project is needed. After you create this project, you can create
                            a many project as you want.
                        </p>
                    </div>

                    <div className={css.content}>
                        <FormProvider {...methods}>
                            <form
                                className={css.form}
                                onSubmit={handleSubmit((data) => {
                                    mutateProject({
                                        name: data.name,
                                    });
                                })}>
                                <TextInput
                                    {...register('name', {
                                        required: 'Project name is required',
                                    })}
                                    label="Name"
                                />

                                {projectCreateError && (
                                    <UIError title="Unable to create project at this moment. Please, try again later." />
                                )}

                                <div className={shared.button}>
                                    <Button loading={isLoading} type="submit">
                                        Create
                                    </Button>
                                </div>
                            </form>
                        </FormProvider>
                    </div>
                </>
            )}

            {projectExistsError && <UIError title="Unable to start setup. Please, try again later." />}
        </div>
    );
}
