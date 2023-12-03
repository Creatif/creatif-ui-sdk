import {JSX} from 'react';
import type React, {FunctionComponent} from 'react';

export interface AppShellItems {
    logo: React.ReactNode;
    header: React.ReactNode;
    items: AppShellItem[],
}

export interface AppShellMenu {
    text: string;
    path: string;
    icon?: React.ReactNode;
}

export interface AppShellCreate {
    component: React.ReactNode;
    structure: {
        name: string;
        type: 'list' | 'variable' | 'map';
        entryName?: string;
    }
}

export interface AppShellItem {
    menu: AppShellMenu;
    create: AppShellCreate
}