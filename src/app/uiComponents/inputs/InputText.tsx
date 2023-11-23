import { getOrCreateStore } from '@app/uiComponents/stores/stores';
import {TextInput} from '@mantine/core';
interface Props {
  structureName: string;
  name: string;
  onChange?: (text: string) => void;
}
export default function InputText({ structureName, name }: Props) {
	return <TextInput />;
}
