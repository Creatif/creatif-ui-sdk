import {TextInput} from '@mantine/core';
import { useFormContext} from 'react-hook-form';
import type {TextInputProps} from '@mantine/core';
import type { ValidationRule,RegisterOptions} from 'react-hook-form';
interface Props extends TextInputProps {
  structureName: string;
  name: string;
  options?: RegisterOptions;
}
export default function InputText({ structureName, name, options, ...rest }: Props) {
	const {register, formState: {errors}} = useFormContext();
	return <TextInput error={Boolean(errors[name])} {...register(name, options)} {...rest} />;
}
