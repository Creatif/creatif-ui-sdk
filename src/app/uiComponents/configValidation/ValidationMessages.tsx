// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from '@app/uiComponents/configValidation/css/validationMessages.module.css';
import { IconArrowBadgeRightFilled } from '@tabler/icons-react';

interface Props {
    messages: string[];
}

export function ValidationMessages({ messages }: Props) {
    return (
        <div className={css.root}>
            <h1 className={css.header}>
                Your configuration file is invalid. There are the error messages. Please, correct the in order to
                continue.
            </h1>

            {messages.map((m, i) => (
                <p className={css.message} key={i}>
                    <IconArrowBadgeRightFilled size={16} color="var(--mantine-color-red-7)" />
                    {m}
                </p>
            ))}
        </div>
    );
}
