import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import { Radio } from '@mantine/core';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { RadioGroupProps } from '@mantine/core';
import type { PropsWithChildren, ReactNode } from 'react';
import type { RegisterOptions, FieldValues, FormState } from 'react-hook-form';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
interface Props extends RadioGroupProps {
    name: string;
    validation?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    onInputChange?: (value: string) => void;
    component?: (data: { value: string; formState: FormState<FieldValues> }) => React.ReactNode;
    children?: ReactNode;
}
export default function InputRadioGroupControlled({
	name,
	validation,
	onInputChange,
	children,
	defaultValue,
	component,
	...rest
}: Props & PropsWithChildren) {
	if (!component && !children)
		throw new Error(
			`InputRadioGroupControlled component with name '${name}' did not provide either children or component(). You must provide either children or component().`,
		);
	const { control, getValues, formState } = useFormContext();
	const [value, setValue] = useState<string>(defaultValue || getValues(name));

	return (
		<Controller
			control={control}
			render={({ field: { onChange } }) => (
				<Radio.Group
					value={value}
					error={useFirstError(name)}
					onChange={(value) => {
						onChange(value);
						onInputChange?.(value);
						setValue(value);
					}}
					{...rest}>
					{component ? component({ value: value, formState: formState }) : children}
				</Radio.Group>
			)}
			name={name}
			rules={validation}
		/>
	);
}
