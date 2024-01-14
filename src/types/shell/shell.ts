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
    structureType: StructureType;

    createComponent: React.ReactNode;
    updateComponent: React.ReactNode;
}

export type StructureType = 'map' | 'list' | 'variable';
