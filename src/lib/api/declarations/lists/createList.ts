import {Initialize} from '@app/initialize';
import { declarations } from '@lib/http/axios';
import { tryPut } from '@lib/http/tryPut';
import type {CreateListBlueprint} from '@lib/api/declarations/listTypes';
export async function createList(blueprint: CreateListBlueprint) {
	return tryPut(declarations(), `/list/${Initialize.ProjectID()}/${blueprint.locale ? blueprint.locale : Initialize.Locale()}`, {
		name: blueprint.name,
	});
}
