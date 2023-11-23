import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import {Textarea} from '@mantine/core';
import { useFormContext} from 'react-hook-form';
import type {TextareaProps} from '@mantine/core';
import type { RegisterOptions} from 'react-hook-form';
interface Props extends TextareaProps {
    structureName: string;
    name: string;
    options?: RegisterOptions;
}
export default function InputTextarea({ structureName, name, options, ...rest }: Props) {
	const {register} = useFormContext();
	return <Textarea error={useFirstError(name)} {...register(name, options)} {...rest} />;
}
