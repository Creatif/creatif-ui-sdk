// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/dashboard/css/structure.module.css';
import CreateNew from '@app/uiComponents/button/CreateNew';
import type { DashboardStructure } from '@root/types/api/stats';
import appDate from '@lib/helpers/appDate';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import classNames from 'classnames';

interface Props {
    structure: DashboardStructure;
}

export function Item({ structure }: Props) {
    const structureItem = getProjectMetadataStore()
        .getState()
        .getStructureItemByID(structure.id || '');

    return (
        <div className={styles.root}>
            <div>
                <h2 className={styles.header}>
                    <span className={styles.structureName}>{structure.name}</span>{' '}
                    <span className={styles.separator}>/</span>
                    <span className={classNames(styles.structureName, styles.number)}>{structure.count}</span> items
                </h2>
                <span className={styles.createdAt}>Created at: {appDate(structure.createdAt)}</span>
            </div>

            <CreateNew path={(structureItem && `${structureItem.navigationCreatePath}/${structureItem.id}`) || ''} />
        </div>
    );
}
