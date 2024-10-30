import type { StructureType } from '@root/types/shell/shell';
import type { DashboardStructure } from '@root/types/api/stats';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/dashboard/css/list.module.css';
import { Item } from '@app/routes/dashboard/structures/Item';

interface Props {
    type: StructureType;
    structures: DashboardStructure[];
}

export function List({ type, structures }: Props) {
    return (
        <div className={styles.root}>
            <h1 className={styles.heading}>{type === 'list' ? 'LISTS' : 'MAPS'}</h1>

            {structures.map((s) => (
                <Item key={s.id} structure={s} />
            ))}
        </div>
    );
}
