import {SegmentedControl} from '@mantine/core';
import {useEffect, useState} from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { SegmentedControlProps, SegmentedControlItem} from '@mantine/core';
interface Props extends SegmentedControlProps {
    name: string;
    onInputChange?: (value: string) => void;
}
export default function InputSegmentedControlControlled({
	name,
	defaultValue,
	onInputChange,
	data,
	...rest
}: Props) {
	if (data.length === 0) throw new Error('\'data\' cannot be an empty array. It must be a string[]');

	const { control, setValue: setFormValue } = useFormContext();
	const [value, setValue] = useState<string | undefined>(defaultValue ? defaultValue : (data[0] as SegmentedControlItem).value);

	useEffect(() => {
		setFormValue(name, defaultValue ? defaultValue : (data[0] as SegmentedControlItem).value);
	}, []);
	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { onChange } }) => (
				<SegmentedControl
					value={value}
					data={data}
					onChange={(value) => {
						onChange(value);
						onInputChange?.(value);
						setValue(value);
					}}
					{...rest}
				/>
			)}
		/>
	);
}
