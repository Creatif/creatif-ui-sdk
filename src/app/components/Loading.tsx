import { Loader } from '@mantine/core';

interface Props {
    isLoading: boolean;
}
export default function Loading({ isLoading }: Props) {
    if (!isLoading) return null;

    return (
        <Loader
            size="sm"
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}
        />
    );
}
