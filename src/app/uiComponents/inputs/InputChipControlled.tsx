import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import {Chip} from '@mantine/core';
import {useState} from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import styles from './css/InputChip.module.css';
import type { ChipProps} from '@mantine/core';
import type {PropsWithChildren} from 'react';
import type { RegisterOptions } from 'react-hook-form/dist/types/validator';
interface Props extends ChipProps {
    name: string;
    format?: string;
    validation?: Omit<
        RegisterOptions,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
    >;
    onInputChange?: (checked: boolean) => void;
}
export default function InputChipControlled({
	name,
	validation,
	onInputChange,
	children,
	defaultChecked,
	...rest
}: Props & PropsWithChildren) {
	const { control } = useFormContext();
	const [checked, setChecked] = useState<boolean | undefined>(defaultChecked);
	const err = useFirstError(name);

	return (
		<Controller
			rules={validation}
			control={control}
			name={name}
			render={({ field: { onChange: onChange } }) => (
				<>
					<Chip
						checked={checked}
						className={err ? styles.root : undefined}
						onChange={(value) => {
							console.log(value);
							onChange(value);
							onInputChange?.(value);
							setChecked((value) => !value);
						}}
						{...rest}
					>
						{children}
					</Chip>

					{err && <span className={styles.errorMessage}>{err}</span>}
				</>
			)}
		/>
	);
}
