import {getOrCreateStore} from '@app/uiComponents/stores/stores';
import {InputText as PrimeInputText} from 'primereact/inputtext';
interface Props {
    structureName: string;
    name: string;
    onChange?: (text: string) => void;
}
export default function InputText({structureName, name}: Props) {
	return <PrimeInputText />;
}