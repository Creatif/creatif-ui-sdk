import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand';
interface OptionsStore {
  structureName: string;
  paths: {
	  listing: string;
	  create: string;
  };
  type: string;
}
interface Props {
  structureName: string;
  path: string;
  type: string;
}

const store: Record<string, UseBoundStore<StoreApi<OptionsStore>>> = {};
export function createOptions({ structureName, path, type }: Props) {
	const name = `${structureName}-options`;

	if (store[name]) throw new Error(`Store with name '${name}' already exists. This is definitely a bug.`);

	store[name] = create<OptionsStore>(() => ({
		paths: {
			listing: `/${path}`,
			create: `/${path}/create`,
		},
		type: type,
		structureName: name,
	}));
}

export function getOptions(structureName: string) {
	const name = `${structureName}-options`;

	if (!store[name]) throw new Error(`Cannot find store for '${name}'. This is definitely a bug.`);

	return store[name];
}
