import {app} from '@lib/http/axios';
import {tryGet} from '@lib/http/tryGet';
import type {ProjectMetadata} from '@lib/api/project/types/ProjectMetadata';
export async function getProjectMetadata() {
	return await tryGet<ProjectMetadata>(
		app(),
		'/project-metadata',
	);
}