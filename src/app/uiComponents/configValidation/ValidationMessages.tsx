// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from '@app/uiComponents/configValidation/css/validationMessages.module.css';
import { IconArrowBadgeRightFilled } from '@tabler/icons-react';
import classNames from 'classnames';

interface Props {
    messages: string[];

    theme?: 'dark' | 'light';
}

export function ValidationMessages({ messages, theme = 'light' }: Props) {
    const themeHeader = theme === 'light' ? css.light : css.dark;
    const themeMessage = theme === 'light' ? css.lightRed : css.darkRed;

    return (
        <div className={css.root}>
            <p className={classNames(css.header, themeHeader)}>
                Your configuration file is invalid. These are the error messages. Please, correct them in order to
                continue.
            </p>

            {messages.map((m, i) => (
                <p className={classNames(css.message, themeMessage)} key={i}>
                    <IconArrowBadgeRightFilled size={16} color="var(--mantine-color-red-7)" />
                    {m}
                </p>
            ))}
        </div>
    );
}
