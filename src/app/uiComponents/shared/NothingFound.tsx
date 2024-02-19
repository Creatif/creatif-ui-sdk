import CreateNew from '@app/uiComponents/button/CreateNew';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/lists/list/css/NothingFound.module.css';

interface Props {
    createNewPath?: string;
}

export default function NothingFound({ createNewPath }: Props) {
    return (
        <div className={styles.root}>
            <div className={styles.inner}>
                <p>NOTHING FOUND</p>

                {createNewPath && <CreateNew path={createNewPath} />}
            </div>
        </div>
    );
}
