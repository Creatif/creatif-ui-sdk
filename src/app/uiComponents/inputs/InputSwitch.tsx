import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import {Switch} from '@mantine/core';
import { useFormContext} from 'react-hook-form';
import type { SwitchProps} from '@mantine/core';
import type {RegisterOptions} from 'react-hook-form';
interface Props extends SwitchProps {
    name: string;
    options?: RegisterOptions;
}
export default function InputSwitch({ name, options, ...rest }: Props) {
	const { register, getValues } = useFormContext();

	return (
		<Switch
			defaultChecked={getValues(name)}
			error={useFirstError(name)}
			{...register(name, options)}
			{...rest}
		/>
	);
}
