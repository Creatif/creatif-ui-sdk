import CreateNew from '@app/uiComponents/button/CreateNew';
import styles from '@app/uiComponents/listing/css/NothingFound.module.css';

interface Props {
	structureName: string
}

export default function NothingFound({structureName}: Props) {
	return <div className={styles.root}>
		<div className={styles.inner}>
			<p>NOTHING FOUND</p>

			<CreateNew structureName={structureName} />
		</div>
	</div>;
}