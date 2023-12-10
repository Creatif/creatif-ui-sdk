import { app } from '@lib/http/axios';
import { tryGet } from '@lib/http/tryGet';
import type { ProjectMetadata } from '@lib/api/project/types/ProjectMetadata';
export async function getProjectMetadata(apiKey: string, projectId: string) {
	return await tryGet<ProjectMetadata>(app(), '/project-metadata', {
		'X-CREATIF-API-KEY': apiKey,
		'X-CREATIF-PROJECT-ID': projectId,
	});
}
