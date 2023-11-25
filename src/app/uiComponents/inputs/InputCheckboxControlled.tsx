import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import { Checkbox } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';
import type { CheckboxProps } from '@mantine/core';
import type { RegisterOptions } from 'react-hook-form';
interface Props extends CheckboxProps {
  name: string;
  onInputChange?: (value: boolean) => void;
  validation?: Omit<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  options?: RegisterOptions;
}
export default function InputCheckboxControlled({
	name,
	validation,
	defaultChecked,
	onInputChange,
	...rest
}: Props) {
	const [checked, setChecked] = useState(defaultChecked);
	const { control } = useFormContext();

	return <Controller
		rules={validation}
		control={control}
		name={name}
		render={({ field: { onChange: onChange } }) => (
			<Checkbox
				defaultChecked={checked}
				error={useFirstError(name)}
				onChange={(event) => {
					onChange(event.currentTarget.checked);
					onInputChange?.(event.currentTarget.checked);
					setChecked(event.currentTarget.checked);
				}}
				{...rest}
			/>
		)}
	/>;
}