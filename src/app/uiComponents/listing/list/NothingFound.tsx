import CreateNew from '@app/uiComponents/button/CreateNew';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/listing/list/css/NothingFound.module.css';

interface Props {
    structureName: string;
}

export default function NothingFound({ structureName }: Props) {
	return (
		<div className={styles.root}>
			<div className={styles.inner}>
				<p>NOTHING FOUND</p>

				<CreateNew structureName={structureName} />
			</div>
		</div>
	);
}
