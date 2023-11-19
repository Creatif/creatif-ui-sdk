import {create} from 'zustand';
import type { StoreApi, UseBoundStore} from 'zustand';
interface FieldsStore {
    fieldStore: {
        fields: string[];
    }
}
interface Props {
    name: string;
}
const stores: Record<string, UseBoundStore<StoreApi<FieldsStore>>> = {};
export function getOrCreateStore({name}: Props) {
	const useFieldsStore = create<FieldsStore>((set) => ({
		fieldStore: {
			fields: [],
		},
		addField: () => set((state) => state),
	}));

	if (stores[name]) {
		return stores[name];
	}

	stores[name] = useFieldsStore;

	return stores[name];
}



