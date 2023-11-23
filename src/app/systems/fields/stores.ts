import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand';
interface FieldsStore {
	currentFields: string[],
  	addField: (field: string) => void;
}
interface Props {
  structureName: string;
}

const stores: Record<string, UseBoundStore<StoreApi<FieldsStore>>> = {};
export function getOrCreateStore({ structureName }: Props) {
	if (stores[structureName]) {
		return stores[structureName];
	}

	stores[structureName] = create<FieldsStore>((set) => ({
		currentFields: [],
		addField: (field: string) => set((state) => ({
			...state,
			currentFields: [...state.currentFields, field],
		})),
	}));

	return stores[structureName];
}
export function useAddField(name: string, store: UseBoundStore<StoreApi<FieldsStore>>) {
	const {addField, currentFields} = store();
	console.log(currentFields);
	return () => addField(name);
}
