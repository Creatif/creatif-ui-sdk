import type { BeforeSaveReturnType } from '@app/uiComponents/types/forms';

export default function valueMetadataValidator(obj: BeforeSaveReturnType | undefined): boolean {
	if (!obj) return false;

	return Object.hasOwn(obj, 'value') && Object.hasOwn(obj, 'metadata');
}
