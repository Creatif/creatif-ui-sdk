import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import { Radio } from '@mantine/core';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { RadioProps } from '@mantine/core';
import type { RegisterOptions } from 'react-hook-form';
interface Props extends RadioProps {
  name: string;
  onInputChange?: (value: boolean) => void;
  validation?: Omit<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
}
export default function InputRadioControlled({
	name,
	validation,
	onInputChange,
	...rest
}: Props) {
	const { control, getValues } = useFormContext();
	const [checked, setChecked] = useState(getValues(name));

	return (
		<Controller
			rules={validation}
			control={control}
			name={name}
			render={({ field: { onChange: onChange } }) => (
				<Radio
					checked={checked}
					error={useFirstError(name)}
					onChange={(event) => {
						onChange(event.currentTarget.checked);
						onInputChange?.(event.currentTarget.checked);
						setChecked(event.currentTarget.checked);
					}}
					{...rest}
				/>
			)}
		/>
	);
}
