import React from 'react';
import type {PropsWithChildren} from 'react';
interface Props {
    nodes?: BatchParameter[];
}
export function UiProvider({children, nodes}: Props & PropsWithChildren) {
	return <>
		{children}
	</>;
}