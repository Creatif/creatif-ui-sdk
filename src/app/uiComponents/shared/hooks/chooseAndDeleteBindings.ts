import { chooseBehaviour, chooseGroups, chooseLocale } from '@app/uiComponents/shared/hooks/useResolveBindings';
import type { Behaviour } from '@root/types/api/shared';

export interface IncomingValues {
    locale: string;
    behaviour: Behaviour | undefined;
    groups: string[];
}
export default function chooseAndDeleteBindings(
    value: IncomingValues,
    incomingLocale: string | undefined,
    incomingBehaviour: Behaviour | undefined,
    incomingGroups: string[],
) {
    const chosenLocale = chooseLocale((value as IncomingValues).locale, incomingLocale);
    if (Object.hasOwn(value, 'locale')) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete value.locale;
    }

    const chosenGroups = chooseGroups(value.groups || ['default'], incomingGroups || ['default']);
    if (Object.hasOwn(value as object, 'groups')) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete value.groups;
    }

    const chosenBehaviour = chooseBehaviour(value.behaviour, incomingBehaviour);
    if (Object.hasOwn(value, 'behaviour')) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete value.behaviour;
    }

    return { chosenLocale, chosenGroups, chosenBehaviour };
}
