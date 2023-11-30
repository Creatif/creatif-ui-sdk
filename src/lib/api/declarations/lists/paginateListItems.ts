import {Initialize} from '@app/initialize';
import {queryConstructor} from '@lib/api/declarations/queryConstructor';
import {declarations} from '@lib/http/axios';
import {tryGet} from '@lib/http/tryGet';
import type {ListingPagination, PaginationResult} from '@lib/api/declarations/types/listTypes';
export async function paginateListItems<Value = unknown, Metadata = unknown>(blueprint: ListingPagination) {
	const locale = blueprint.locale ? blueprint.locale : Initialize.Locale();
	const limit = blueprint.limit || 15;
	const page = blueprint.page || 1;
	const groups = blueprint.groups || [];
	const orderBy = blueprint.orderBy || 'created_at';
	const direction = blueprint.direction || 'desc';

	return await tryGet<PaginationResult<Value, Metadata>>(
		declarations(),
		`/lists/${Initialize.ProjectID()}/${locale}/${blueprint.name}${queryConstructor(page, limit, groups, orderBy, direction)}`,
	);
}
