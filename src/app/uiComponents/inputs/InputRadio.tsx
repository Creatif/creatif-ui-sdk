import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import { Radio } from '@mantine/core';
import { useFormContext } from 'react-hook-form';
import type { RadioProps } from '@mantine/core';
import type { RegisterOptions } from 'react-hook-form';
interface Props extends RadioProps {
    name: string;
    options?: RegisterOptions;
}
/**
 * TODO: mention that when selected, value is 'on'.
 */
export function InputRadio({ name, options, ...rest }: Props) {
    const { register } = useFormContext();

    return <Radio error={useFirstError(name)} {...register(name, options)} {...rest} />;
}
