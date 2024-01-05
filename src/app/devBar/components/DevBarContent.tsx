// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/devBar/css/devBarContent.module.css';
import SwitchEnvironment from '@app/devBar/components/SwitchEnvironment';
import type { ContentState } from '@app/devBar/hooks/useContentState';
import useContentState from '@app/devBar/hooks/useContentState';
import TopActions from '@app/devBar/components/TopActions';
import TabContent from '@app/devBar/components/TabContent';
export default function DevBarContent() {
    const { state, changeState } = useContentState();

    return (
        <div className={styles.root}>
            <TopActions onSwitchEnvironment={() => changeState('switchEnvironment')} />
            <TabContent
                currentTab={state}
                onTabChange={(tab) => {
                    if (!tab) return;

                    changeState(tab as ContentState);
                }}
            />

            <div className={styles.content}>{state === 'switchEnvironment' && <SwitchEnvironment />}</div>
        </div>
    );
}
