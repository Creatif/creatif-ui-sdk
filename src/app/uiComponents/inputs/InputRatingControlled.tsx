import {Rating} from '@mantine/core';
import {useState} from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { RatingProps} from '@mantine/core';
interface Props extends RatingProps {
    name: string;
    onInputChange?: (value: number) => void;
}
export default function InputRatingControlled({
	name,
	defaultValue,
	onInputChange,
	...rest
}: Props) {
	const [value, setValue] = useState(defaultValue);
	const { control } = useFormContext();

	return <Controller
		control={control}
		name={name}
		render={({ field: { onChange: onChange } }) => (
			<Rating
				value={value}
				onChange={(value) => {
					onChange(value);
					onInputChange?.(value);
					setValue(value);
				}}
				{...rest}
			/>
		)}
	/>;
}