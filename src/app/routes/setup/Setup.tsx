// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from '@app/routes/setup/css/setup.module.css';
import { useMutation, useQuery } from 'react-query';
import hasProjects from '@lib/api/project/hasProject';
import UIError from '@app/components/UIError';
import type { ApiError } from '@lib/http/apiError';
import type { TryResult } from '@root/types/shared';
import Loading from '@app/components/Loading';
import type { CreateProjectBlueprint, Project } from '@root/types/api/project';
import createProject from '@lib/api/project/createProject';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreatifApp } from '@root/types/shell/shell';

interface Props {
    config: CreatifApp;
}

export function Setup({ config }: Props) {
    const navigate = useNavigate();

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
        isLoading: isProjectCreateLoading,
        error: projectCreateError,
        data: createdProjectData,
    } = useMutation<TryResult<Project>, ApiError, CreateProjectBlueprint>((data) => createProject(data));

    /**
     * A lot of useEffects, needs another thought
     */
    useEffect(() => {
        if (isFetching) return;

        if (!isFetching && projectExistsData && projectExistsData.result) {
            navigate('/dashboard');
            return;
        }

        if (projectExistsData && !projectExistsData.result) {
            const projectName = config.projectName;

            mutateProject({
                name: projectName,
            });
        }
    }, [projectExistsData, isFetching]);

    useEffect(() => {
        if (!isProjectCreateLoading && createdProjectData?.result) {
            navigate(`/dashboard/${createdProjectData.result.id}`);
        }
    }, [isProjectCreateLoading, createdProjectData]);

    useEffect(() => {
        if (projectExistsData?.result) {
            navigate('/dashboard');
        }
    }, [projectExistsData]);

    const isProcessing = isFetching || isProjectCreateLoading;

    return (
        <div className={css.root}>
            <Loading isLoading={isProcessing} />

            {(projectExistsError || projectCreateError) && (
                <UIError title="Unable to start setup. Please, try again later." />
            )}
        </div>
    );
}
