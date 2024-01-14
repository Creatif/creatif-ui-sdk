import { Button } from '@mantine/core';
import { Link } from 'react-router-dom';
interface Props {
    path: string;
}
export default function CreateNew({ path }: Props) {
    return (
        <Button to={path} component={Link}>
            Create new
        </Button>
    );
}
