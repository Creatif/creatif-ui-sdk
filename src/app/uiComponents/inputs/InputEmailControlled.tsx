import InputText from '@app/uiComponents/inputs/InputText';
import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { TextInputProps } from '@mantine/core';
import type { RegisterOptions } from 'react-hook-form';

interface Props extends TextInputProps {
    name: string;
    validation?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    onInputChange?: (value: string) => void;
}
export default function InputEmailControlled({ name, validation, onInputChange, ...rest }: Props) {
	const { control, getValues } = useFormContext();
	const [value, setValue] = useState<string>(getValues(name));
	let optionsCopy = {};
	if (validation) {
		optionsCopy = validation;
	}

	optionsCopy = {
		...optionsCopy,
		pattern: {
			value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			message: 'Provided email is invalid',
		},
	};

	return (
		<Controller
			control={control}
			name={name}
			rules={validation}
			render={({ field: { onChange } }) => (
				<InputText
					error={useFirstError(name)}
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
