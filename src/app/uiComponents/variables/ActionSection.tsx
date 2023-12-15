import CreateNew from '@app/uiComponents/button/CreateNew';
import { Loader } from '@mantine/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/ActionSection.module.css';
interface Props {
    isLoading: boolean;
    structureName: string;
}
export default function ActionSection({ isLoading, structureName }: Props) {
    return (
        <div className={styles.root}>
            <div className={styles.buttonWidthLoadingWrapper}>
                {isLoading && <Loader size={20} />}
                <CreateNew structureName={structureName} />
            </div>
        </div>
    );
}
