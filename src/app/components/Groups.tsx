// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/components/css/groups.module.css';
import { Pill, Popover } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';

interface Props {
    groups: string[];
}

function GroupsPopover({ groups }: Props) {
    const [isOpened, { close, open }] = useDisclosure(false);

    return (
        <>
            {groups.length > 3 && (
                <Popover width={240} withArrow shadow="md" opened={isOpened}>
                    <Popover.Target>
                        <p onMouseEnter={open} onMouseLeave={close} className={styles.popoverTarget}>
                            <IconPlus size={10} />
                            {groups.length - 3}
                        </p>
                    </Popover.Target>

                    <Popover.Dropdown style={{ pointerEvents: 'none', borderRadius: '1rem' }}>
                        <div className={styles.groupsList}>
                            {groups.map((item, i) => (
                                <Pill
                                    key={i}
                                    styles={{
                                        root: {
                                            backgroundColor: 'var(--mantine-color-blue-0)',
                                            margin: '0.2rem 0.2rem 0.2rem 0',
                                        },
                                        label: { cursor: 'pointer' },
                                    }}>
                                    {item}
                                </Pill>
                            ))}
                        </div>
                    </Popover.Dropdown>
                </Popover>
            )}
        </>
    );
}

export default function Groups({ groups }: Props) {
    return (
        <div className={styles.groups}>
            {groups.slice(0, 3).map((item) => (
                <Pill
                    key={item}
                    styles={{
                        root: { backgroundColor: 'var(--mantine-color-blue-0)' },
                        label: { cursor: 'pointer' },
                    }}>
                    {item}
                </Pill>
            ))}

            <GroupsPopover groups={groups} />
        </div>
    );
}
