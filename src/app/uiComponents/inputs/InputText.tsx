import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import {TextInput} from '@mantine/core';
import { useFormContext} from 'react-hook-form';
import type {TextInputProps} from '@mantine/core';
import type { RegisterOptions} from 'react-hook-form';
interface Props extends TextInputProps {
  name: string;
  options?: RegisterOptions;
}
export default function InputText({ name, options, ...rest }: Props) {
	const {register} = useFormContext();

	return <TextInput error={useFirstError(name)} {...register(name, options)} {...rest} />;
}
