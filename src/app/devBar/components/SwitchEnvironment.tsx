// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/devBar/css/switchEnvironment.module.css';
import { Badge, Switch } from '@mantine/core';
import { getEnvironmentStore } from '@app/systems/stores/environmentStore';
export default function SwitchEnvironment() {
    const useEnvironmentStore = getEnvironmentStore();
    const currentEnv = useEnvironmentStore((state) => state.environment);
    const changeEnvironment = useEnvironmentStore((state) => state.changeEnvironment);

    return (
        <div className={styles.root}>
            <h1 className={styles.heading}>SWITCH ENVIRONMENT</h1>
            <div className={styles.description}>
                When in <Badge color="orange">DEV</Badge> environment, all data is saved in the browser and it is not
                persisted to the cloud. This is useful when you still don&apos;t know how your data will look like or
                you are just testing some other possibilities. When you are ready and certain that your app is ready to
                be persisted, turn on <Badge color="green">PROD</Badge> mode.
            </div>

            <div className={styles.switchWrapper}>
                <div>
                    Current environment{' '}
                    {currentEnv === 'dev' ? <Badge color="orange">DEV</Badge> : <Badge color="green">PROD</Badge>}
                </div>

                <Switch
                    size="md"
                    checked={Boolean(currentEnv !== 'dev')}
                    onChange={() => {
                        changeEnvironment(currentEnv === 'dev' ? 'prod' : 'dev');
                    }}
                />
            </div>
        </div>
    );
}
