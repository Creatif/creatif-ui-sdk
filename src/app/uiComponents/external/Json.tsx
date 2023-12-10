import { JsonView } from '@zerodevx/svelte-json-view/dist';
import { useEffect, useRef } from 'react';
import styles from './json.module.css';

interface Props {
    value: object;
}
export default function JSON({ value }: Props) {
	const ref = useRef(null);

	useEffect(() => {
		if (ref.current) {
			const app = new JsonView({
				target: ref.current, // node to render into
			});

			app.$set({
				json: value,
			});
		}
	}, []);

	return (
		<div
			className={styles.root}
			style={{
				fontFamily: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace',
				fontSize: '0.8rem',
				'--jsonPaddingLeft': '1.5rem',
				fontWeight: 200,
				'ul li': 'margin-bottom: 0.4rem',
			}}
			ref={ref}
		/>
	);
}
