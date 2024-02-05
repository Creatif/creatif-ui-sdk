// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/devBar/css/devBarContent.module.css';
import type { ContentState } from '@app/devBar/hooks/useContentState';
import useContentState from '@app/devBar/hooks/useContentState';
import TabContent from '@app/devBar/components/TabContent';
export default function DevBarContent() {
    const { state, changeState } = useContentState();

    return (
        <div className={styles.root}>
            <TabContent
                currentTab={state}
                onTabChange={(tab) => {
                    if (!tab) return;

                    changeState(tab as ContentState);
                }}
            />
        </div>
    );
}
