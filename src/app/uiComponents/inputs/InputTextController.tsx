import InputText from '@app/uiComponents/inputs/InputText';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { TextInputProps } from '@mantine/core';
import type { RegisterOptions } from 'react-hook-form';

interface Props extends TextInputProps {
  name: string;
  validation?: Omit<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  onInputChange?: (value: string) => void;
}
export default function InputTextControlled({
	name,
	validation,
	onInputChange,
	...rest
}: Props) {
	const [value, setValue] = useState<string>();
	const { control } = useFormContext();

	return (
		<Controller
			control={control}
			name={name}
			rules={validation}
			render={({ field: { onChange } }) => (
				<InputText
					value={value}
					onChange={(event) => {
						onChange(event.currentTarget.value);
						onInputChange?.(event.currentTarget.value);
						setValue(event.currentTarget.value);
					}}
					name={name}
					{...rest}
					options={optionsCopy}
				/>
			)}
		/>
	);
}
