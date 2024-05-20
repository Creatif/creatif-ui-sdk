// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from '@app/components/authentication/css/stepThree.module.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export function StepThree() {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate('/login');
        }, 3000);
    }, []);
    return (
        <div className={css.root}>
            <div className={css.successAnimation}>
                <svg className={css.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className={css.checkmarkCircle} cx="26" cy="26" r="25" fill="none" />
                    <path className={css.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
            </div>

            <p>Admin user created. You will now be redirected to the login screen</p>
        </div>
    );
}
