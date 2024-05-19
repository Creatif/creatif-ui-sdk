// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from '@app/routes/setup/css/setup.module.css';
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
import type { CreateProjectBlueprint, Project } from '@root/types/api/project';
import createProject from '@lib/api/project/createProject';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocalesCache from '@lib/storage/localesCache';
import { Runtime } from '@app/runtime/Runtime';
import CurrentLocaleStorage from '@lib/storage/currentLocaleStorage';
import CurrentProjectCache from '@lib/storage/currentProjectCache';
import { getSupportedLocales } from '@lib/api/project/getSupportedLocales';
import { getProject } from '@lib/api/project/getProject';
import { getStructureMetadata } from '@lib/api/project/getStructureMetadata';
import type { CreatifApp, StructureType } from '@root/types/shell/shell';
import { createProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';

async function writeLocalesToCache(): Promise<{ cache?: LocalesCache; error?: ApiError }> {
    if (!LocalesCache.isLoaded()) {
        const { result, error } = await getSupportedLocales();

        if (result) {
            return { cache: new LocalesCache(result) };
        }

        return { error: error };
    }

    return { cache: LocalesCache.createInstanceWithExistingCache() };
}

async function createStructureMetadataStore(
    projectId: string,
    config: { name: string; type: StructureType }[],
): Promise<{ error?: ApiError }> {
    const { result, error } = await getStructureMetadata({
        projectId: projectId,
        config: config,
    });

    if (error) return { error: error };

    if (result) {
        createProjectMetadataStore(result.metadata, result.structures);
    }

    return { error: undefined };
}

async function writeCurrentProjectCache(projectId: string): Promise<{ cache?: CurrentProjectCache; error?: ApiError }> {
    if (!CurrentProjectCache.isLoaded()) {
        const { result, error } = await getProject(projectId);

        if (result) {
            return { cache: new CurrentProjectCache(result) };
        }

        return { error: error };
    }

    return { cache: CurrentProjectCache.createInstanceWithExistingCache() };
}

async function createRuntime(
    projectId: string,
    config: { name: string; type: StructureType }[],
): Promise<ApiError | undefined> {
    const { cache: projectCache, error: projectError } = await writeCurrentProjectCache(projectId);
    if (projectError) return projectError;

    const { cache: localesCache, error: localesError } = await writeLocalesToCache();
    if (localesError) return localesError;

    if (projectCache && localesCache) {
        Runtime.init(new Runtime(projectCache, new CurrentLocaleStorage('eng'), localesCache));
    }

    const { error: metadataStoreError } = await createStructureMetadataStore(projectId, config);
    if (metadataStoreError) return metadataStoreError;
}

interface Props {
    config: CreatifApp;
}

export function Setup({ config }: Props) {
    const navigate = useNavigate();
    const [setupError, setSetupError] = useState(false);
    const [isRuntimeProcessing, setIsRuntimeProcessing] = useState(false);

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
    } = useMutation<TryResult<Project>, ApiError, CreateProjectBlueprint>((data) => createProject(data));

    useEffect(() => {
        if (data && data.result) {
            setIsRuntimeProcessing(true);
            const itemsConfig = config.items.map((t) => ({ name: t.structureName, type: t.structureType }));
            createRuntime(data.result.id, itemsConfig).then((error) => {
                if (error) {
                    setSetupError(true);
                    return;
                }

                setIsRuntimeProcessing(false);
                navigate('/dashboard');
            });
        }
    }, [data]);

    useEffect(() => {
        if (projectExistsData?.result) {
            navigate('/dashboard');
        }
    }, [projectExistsData]);

    const methods = useForm();
    const { handleSubmit, register } = methods;

    const isSetupLoading = isLoading || isRuntimeProcessing;

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

                                {setupError && (
                                    <UIError title="Unable to setup your project at this moment. Please, try again later." />
                                )}

                                <div className={shared.button}>
                                    <Button loading={isSetupLoading} type="submit">
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
