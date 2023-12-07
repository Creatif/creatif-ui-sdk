import queryListItemByID from '@lib/api/declarations/lists/queryListItemByID';

class updateList<T = unknown> {
	async updateFn(): Promise<T> {
		return (await queryListItemByID({
			itemId: '',
			structureId: '',
		}) as T);
	}
	transformFn() {

	}
}

export const updateListSystem = new updateList();