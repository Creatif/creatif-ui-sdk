// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/navigation.module.css';
interface Props {
    type: 'map' | 'variable' | 'list';
}
export default function NavigationIcon({ type }: Props) {
    return (
        <span className={styles.navigationIcon}>
            {type === 'map' && 'M'}
            {type === 'variable' && 'V'}
            {type === 'list' && 'L'}
        </span>
    );
}
