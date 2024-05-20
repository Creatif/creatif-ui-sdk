import { Button } from '@mantine/core';
import { IconStackPush } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export function PublishButton() {
    return (
        <Button component={Link} to="publishing" color="green" leftSection={<IconStackPush size={24} />}>
            Publish
        </Button>
    );
}
