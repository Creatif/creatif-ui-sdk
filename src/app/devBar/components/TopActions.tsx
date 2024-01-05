// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/devBar/css/devBarContent.module.css';
import { Badge, Button } from '@mantine/core';
import { IconHelp } from '@tabler/icons-react';
import { getEnvironmentStore } from '@app/systems/stores/environmentStore';

interface Props {
    onSwitchEnvironment: () => void;
}

export default function TopActions({ onSwitchEnvironment }: Props) {
    const useEnvironmentStore = getEnvironmentStore();
    const currentEnv = useEnvironmentStore((state) => state.environment);
    const envBadge = currentEnv === 'dev' ? <Badge color="orange">DEV</Badge> : <Badge color="green">PROD</Badge>;

    return (
        <div className={styles.environmentWrapper}>
            <Button color="gray" variant="outline" rightSection={<IconHelp size={16} color="gray" />}>
                Help
            </Button>

            <Button
                variant="outline"
                color={currentEnv === 'dev' ? 'orange' : 'green'}
                onClick={() => onSwitchEnvironment()}
                rightSection={envBadge}>
                Switch environment
            </Button>
        </div>
    );
}
