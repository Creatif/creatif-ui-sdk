import type { UseFieldArrayProps } from 'react-hook-form';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useConnectionStore } from '@app/systems/stores/inputConnectionStore';

export function useOverrideFieldArray(props: UseFieldArrayProps) {
    const { control } = useFormContext();
    const useConnections = useConnectionStore();
    const {
        fields,
        append,
        prepend,
        remove: fieldArrayRemove,
        swap,
        move,
        insert,
    } = useFieldArray({
        name: props.name,
        control,
    });

    return {
        fields,
        append,
        prepend,
        remove: (name: string, index: number) => {
            fieldArrayRemove(index);
            useConnections.getState().remove(name);
        },
        swap,
        move,
        insert,
    };
}
