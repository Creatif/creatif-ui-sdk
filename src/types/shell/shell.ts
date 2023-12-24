import type React from 'react';

export interface CreatifApp {
    logo: React.ReactNode;
    items: AppShellItem[];
}

export interface Shell {
    logo: React.ReactNode;
    header: React.ReactNode;
    items: AppShellItem[];
}

export interface AppShellItem {
    menuText: string;
    routePath: string;
    menuIcon?: React.ReactNode;

    structureName: string;
    structureType: 'list' | 'variable' | 'map';

    createComponent: React.ReactNode;
    updateComponent: React.ReactNode;
}
