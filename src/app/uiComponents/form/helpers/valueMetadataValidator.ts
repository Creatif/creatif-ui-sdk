import type { BeforeSaveReturnType } from '@root/types/forms/forms';

export default function valueMetadataValidator(obj: BeforeSaveReturnType | undefined): boolean {
    if (!obj) return false;

    return Object.hasOwn(obj, 'value') && Object.hasOwn(obj, 'metadata');
}
