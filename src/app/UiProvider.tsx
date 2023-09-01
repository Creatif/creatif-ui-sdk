import React from "react";
import {PropsWithChildren} from "react";
interface Props {
    nodes: BatchParameter[];
}
export function UiProvider({children, nodes}: Props & PropsWithChildren) {
    return <>
        {children}
    </>
}