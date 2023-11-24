import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import {Checkbox, Group} from '@mantine/core';
import { useState} from 'react';
import {Controller, FieldErrors, useFormContext} from 'react-hook-form';
import type { CheckboxGroupProps} from '@mantine/core';
import type {PropsWithChildren,ReactNode} from 'react';
import type {RegisterOptions, FieldValues, FormState} from 'react-hook-form';
interface Props extends CheckboxGroupProps {
	name: string;
	format?: string;
	validation?: Omit<
		RegisterOptions,
		'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
	>;
	onInputChange?: (value: string[]) => void;
	component?: (data: {value: string[], formState: FormState<FieldValues>}) => React.ReactNode;
	children?: ReactNode;
}
export default function InputCheckboxGroupControlled({name, validation, onInputChange, children, component, ...rest}: Props & PropsWithChildren) {
	const {control, formState} = useFormContext();
	const [value, setValue] = useState<string[]>([]);

	return (
		<Controller control={control} render={({field: {onChange}}) => <Checkbox.Group
			value={value}
			error={useFirstError(name)}
			onChange={(value) => {
				onChange(value);
				onInputChange?.(value);
				setValue(value);
			}}
			{...rest}
		>
			{component ? component({value: value, formState: formState}) : children}
		</Checkbox.Group>} name={name} rules={validation} />
	);
}