import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import { Checkbox } from '@mantine/core';
import { useFormContext } from 'react-hook-form';
import type { CheckboxProps } from '@mantine/core';
import type { RegisterOptions } from 'react-hook-form';
interface Props extends CheckboxProps {
  name: string;
  options?: RegisterOptions;
}
export default function InputCheckbox({ name, options, ...rest }: Props) {
	const { register } = useFormContext();

	return (
		<Checkbox
			error={useFirstError(name)}
			{...register(name, options)}
			{...rest}
		/>
	);
}
