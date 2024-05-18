// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from '@app/components/authentication/css/adminWizard.module.css';
import { StepOne } from '@app/components/authentication/StepOne';
import { useState } from 'react';
import { StepTwo } from '@app/components/authentication/StepTwo';
import { StepThree } from '@app/components/authentication/StepThree';

export function AdminWizard() {
    const [currentStep, setCurrentStep] = useState(0);

    return (
        <div className={css.root}>
            {currentStep === 0 && <StepOne onContinue={() => setCurrentStep(1)} />}
            {currentStep === 1 && <StepTwo onContinue={() => setCurrentStep(2)} />}
            {currentStep === 2 && <StepThree />}
        </div>
    );
}
