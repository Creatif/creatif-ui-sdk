import ucFirst from '@lib/helpers/ucFirst';
import { FieldError, useFormState } from 'react-hook-form';

export default function useFirstError(name: string): string | undefined {
    const { errors } = useFormState();
    const arrayError = name.split('.');
    let fieldError = errors[name];
    // this is a useFieldArray error and should be handled differently
    if (arrayError.length !== 0 && errors) {
        const partOne = arrayError[0];
        const partTwo = arrayError[1];
        const partThree = arrayError[2];

        const underlyingMainError = errors[partOne];
        if (!underlyingMainError) return;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const mainError = underlyingMainError[partTwo];
        if (!mainError) return;
        const actualError = mainError[partThree];
        if (!actualError) return;

        if (actualError.ref.name === name) {
            fieldError = actualError;
        }
    }

    //console.log(errors, fieldError, name);
    if (!fieldError) return undefined;

    if (fieldError.message && typeof fieldError?.message === 'string') {
        return fieldError.message;
    }

    return `${ucFirst(name)} field is invalid.`;
}
