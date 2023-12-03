import {getOptions} from '@app/systems/stores/options';
import {Button} from '@mantine/core';
import {Link} from 'react-router-dom';
interface Props {
    structureName: string;
}
export default function CreateNew({structureName}: Props) {
	const useOptionsStore = getOptions(structureName);
	const state = useOptionsStore.getState();

	return <Button to={state.paths.create} component={Link}>Create new</Button>;
}