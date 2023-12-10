import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import { PinInput } from '@mantine/core';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import styles from './css/InputPin.module.css';
import type { PinInputProps } from '@mantine/core/lib';
import type { RegisterOptions } from 'react-hook-form';
interface Props extends PinInputProps {
    name: string;
    onInputChange?: (value: string) => void;
    validation?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
}
export default function InputPinControlled({ name, validation, onInputChange, defaultValue, ...rest }: Props) {
	const { control, getValues } = useFormContext();
	const [value, setValue] = useState<string | undefined>(defaultValue || getValues(name));
	const error = useFirstError(name);
	return (
		<>
			<Controller
				rules={validation}
				control={control}
				name={name}
				render={({ field: { onChange } }) => (
					<PinInput
						value={value}
						error={Boolean(error)}
						name={name}
						onChange={(value) => {
							onChange(value);
							onInputChange?.(value);
							setValue(value);
						}}
						{...rest}
					/>
				)}
			/>

			{error && <span className={styles.errorMessage}>{error}</span>}
		</>
	);
}
