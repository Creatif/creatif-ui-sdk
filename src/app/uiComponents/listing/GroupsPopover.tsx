import styles from '@app/uiComponents/listing/css/GroupsPopover.module.css';
import { Pill, Popover } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
interface Props {
    groups: string[];
}
export default function GroupsPopover({ groups }: Props) {
	const [isOpened, { close, open }] = useDisclosure(false);

	return (
		<>
			{groups.length > 3 && (
				<Popover width={240} withArrow shadow="md" opened={isOpened}>
					<Popover.Target>
						<p onMouseEnter={open} onMouseLeave={close} className={styles.popoverTarget}>
							<IconPlus size={10} />
							{groups.length - 3} more
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
