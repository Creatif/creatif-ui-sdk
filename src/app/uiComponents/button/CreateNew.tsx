import { getOptions } from '@app/systems/stores/options';
import { Button } from '@mantine/core';
import { Link } from 'react-router-dom';
interface Props {
    structureName: string;
}
export default function CreateNew({ structureName }: Props) {
    const { store: useOptionsStore } = getOptions(structureName);

    return (
        <>
            {useOptionsStore && <Button to={useOptionsStore.getState().paths.create} component={Link}>
                Create new
            </Button>}
        </>
    );
}
