// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/devBar/css/devBarContent.module.css';
import { Tabs } from '@mantine/core';
import type { ContentState } from '@app/devBar/hooks/useContentState';
import NavigationIcon from '@app/uiComponents/shell/NavigationIcon';
import { IconHistory } from '@tabler/icons-react';

interface Props {
    currentTab: ContentState;
    onTabChange: (tab: string | ContentState | null) => void;
}

export default function TabContent({ currentTab, onTabChange }: Props) {
    return (
        <div className={styles.heading}>
            <div
                style={{
                    flexGrow: '2',
                }}>
                <Tabs value={currentTab} onChange={onTabChange} allowTabDeactivation={true} orientation="vertical">
                    <Tabs.List grow justify="space-between">
                        <Tabs.Tab
                            leftSection={<NavigationIcon type="variable" selected={currentTab === 'variables'} />}
                            value="variables">
                            Variables
                        </Tabs.Tab>
                        <Tabs.Tab
                            leftSection={<NavigationIcon type="list" selected={currentTab === 'lists'} />}
                            value="lists">
                            Lists
                        </Tabs.Tab>
                        <Tabs.Tab
                            leftSection={<NavigationIcon type="map" selected={currentTab === 'maps'} />}
                            value="maps">
                            Maps
                        </Tabs.Tab>
                        <Tabs.Tab leftSection={<IconHistory size={20} color="gray" />} value="history">
                            History
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="variables">Variables</Tabs.Panel>

                    <Tabs.Panel value="lists">Lists</Tabs.Panel>

                    <Tabs.Panel value="maps">Maps</Tabs.Panel>

                    <Tabs.Panel value="history">History</Tabs.Panel>
                </Tabs>
            </div>
        </div>
    );
}
