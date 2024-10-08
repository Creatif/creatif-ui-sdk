// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/navigation.module.css';
import classNames from 'classnames';
import type { StructureType } from '@root/types/shell/shell';
interface Props {
    type: StructureType;
    selected?: boolean;
}
export default function NavigationIcon({ type, selected }: Props) {
    return (
        <span className={classNames(styles.navigationIcon, selected ? styles.selectedNavigationIcon : undefined)}>
            {type === 'map' && 'M'}
            {type === 'list' && 'L'}
        </span>
    );
}
