import {Checkbox} from '@mantine/core';
import { useFormContext} from 'react-hook-form';
import type {TextInputProps, CheckboxProps} from '@mantine/core';
import type { RegisterOptions} from 'react-hook-form';
interface Props extends CheckboxProps {
    structureName: string;
    name: string;
    options?: RegisterOptions;
}
export default function InputCheckbox({ structureName, name, options, ...rest }: Props) {
	const {register, formState: {errors}} = useFormContext();
	return <Checkbox error={Boolean(errors[name])} {...register(name, options)} {...rest} />;
}
