import type React from 'react';

export interface CreatifApp {
    logo: React.ReactNode;
    items: AppShellItem[];
}

export interface AppShellItems {
    logo: React.ReactNode;
    header: React.ReactNode;
    items: AppShellItem[];
}
export interface AppShellMenu {
    text: string;
    path: string;
    icon?: React.ReactNode;
}

export interface AppShellCreate {
    component: React.ReactNode;
}

export interface AppShellItem {
    menu: AppShellMenu;
    structure: { name: string; type: 'list' | 'variable' | 'map' };
    create: AppShellCreate;
    update: AppShellCreate;
}
