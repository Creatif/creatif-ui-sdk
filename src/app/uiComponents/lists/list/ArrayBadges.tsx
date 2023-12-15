// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Badge } from '@mantine/core';
import styles from './css/ArrayBadges.module.css';
interface Props {
    values: unknown[];
}
export default function ArrayBadges({ values }: Props) {
    return (
        <div className={styles.root}>
            {values.map((item, i) => {
                if (typeof item === 'string' || typeof item === 'number') {
                    return (
                        <Badge color="gray" key={i}>
                            {item}
                        </Badge>
                    );
                }

                if (typeof item === 'boolean') {
                    if (item)
                        return (
                            <Badge key={i} color="green">
                                true
                            </Badge>
                        );

                    return (
                        <Badge key={i} color="red">
                            false
                        </Badge>
                    );
                }
            })}
        </div>
    );
}
