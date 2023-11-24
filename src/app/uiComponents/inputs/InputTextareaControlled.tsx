import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import { Textarea } from '@mantine/core';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { TextareaProps } from '@mantine/core';
import type { RegisterOptions } from 'react-hook-form';
interface Props extends TextareaProps {
  name: string;
  validation?: Omit<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  onInputChange?: (value: string) => void;
}
export default function InputTextareaControlled({
	name,
	validation,
	onInputChange,
	...rest
}: Props) {
	const [value, setValue] = useState<string>();
	const { control } = useFormContext();

	return (
		<Controller
			name={name}
			rules={validation}
			control={control}
			render={({ field: { onChange } }) => (
				<Textarea
					value={value}
					error={useFirstError(name)}
					onChange={(event) => {
						onChange(event.currentTarget.value);
						onInputChange?.(event.currentTarget.value);
						setValue(event.currentTarget.value);
					}}
					{...rest}
				/>
			)}
		/>
	);
}
