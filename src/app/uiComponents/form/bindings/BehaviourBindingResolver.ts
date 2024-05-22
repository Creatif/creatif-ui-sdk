import type { BehaviourBinding } from '@root/types/forms/forms';
import type { Behaviour } from '@root/types/api/shared';
import { behaviourField } from '@app/uiComponents/form/bindings/bindingResolver';

interface CastType {
    [key: string]: unknown;
}

export class BehaviourBindingResolver<Value> {
    private key = behaviourField;
    constructor(
        private values: Value,
        private bindFn: BehaviourBinding<Value> | undefined,
    ) {}

    resolve(): Behaviour {
        if (this.bindFn) {
            return this.bindFn(this.values);
        }

        if (!this.bindFn) {
            if (
                this.values &&
                typeof this.values === 'object' &&
                this.key in this.values &&
                typeof (this.values as CastType)[this.key] === 'string' &&
                ((this.values as CastType)[this.key] === 'modifiable' ||
                    (this.values as CastType)[this.key] === 'readonly')
            ) {
                return (this.values as CastType)[this.key] as Behaviour;
            }
        }

        return 'modifiable';
    }
}
