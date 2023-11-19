import {Toast} from 'primereact/toast';
import {useEffect, useRef} from 'react';
import * as React from 'react';
import {create} from 'zustand';
import type { ToastMessage} from 'primereact/toast';
interface notification {
    alert: {
        show: boolean;
        options?: ToastMessage;
    },
    clear: () => void;
    show: (options: ToastMessage) => void;
}
export const useToast = create<notification>((set) => ({
	alert: {
		show: false,
	},
	clear: () => set(() => ({alert: {show: false, options: undefined}})),
	show: (options: ToastMessage) => set(() => ({
		alert: {
			show: true,
			options: options,
		}
	})),
}));
export function Notification() {
	const toast = useRef<Toast>(null);
	const state = useToast();
	const isShown = state.alert.show;
	const options = state.alert.options || {
		severity: 'info',
		summary: 'An action has happened',
	};

	useEffect(() => {
		if (toast.current && isShown) {
			toast.current.show(options);
		}
	}, [isShown]);

	return <Toast ref={toast} />;
}