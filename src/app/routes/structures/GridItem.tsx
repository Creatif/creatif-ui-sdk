// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/lists/css/listGridItem.module.css';
import classNames from 'classnames';
import { useRef, memo } from 'react';
import appDate from '@lib/helpers/appDate';
import type { ListStructure, MapStructure } from '@root/types/api/structures';
import { IconCheck, IconCircleX } from '@tabler/icons-react';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import type { StructureType } from '@root/types/shell/shell';
interface Props {
    item: ListStructure | MapStructure;
    structureType: StructureType;
}
function GridItem({ item, structureType }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const store = getProjectMetadataStore();
    const existsInConfig = store.getState().existsInConfig(item.id, structureType);

    return (
        <div ref={ref} className={classNames(styles.container, styles.pointerContainer)}>
            <h2>{item.name}</h2>

            <div>
                {!existsInConfig && <IconCircleX color="var(--mantine-color-red-7)" size={18} />}
                {existsInConfig && <IconCheck color="var(--mantine-color-green-7)" size={18} />}
            </div>

            <div className={styles.createdAt}>{appDate(item.createdAt)}</div>

            <div className={styles.actionRow} />
        </div>
    );
}

export const Item = memo(GridItem);
