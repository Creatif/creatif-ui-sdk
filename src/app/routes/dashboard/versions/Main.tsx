// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/dashboard/css/list.module.css';
import type { DashboardVersion } from '@root/types/api/stats';
import { PublishButton } from '@app/uiComponents/shell/PublishButton';
import { Item } from '@app/routes/dashboard/versions/Item';
import classNames from 'classnames';

interface Props {
    versions: DashboardVersion[];
}

export function Main({ versions }: Props) {
    return (
        <div className={classNames(styles.root, styles.versionRoot)}>
            <h1 className={classNames(styles.heading, styles.versionHeading)}>
                VERSIONS <PublishButton />
            </h1>

            {versions.map((s) => (
                <Item key={s.id} version={s} />
            ))}
        </div>
    );
}
