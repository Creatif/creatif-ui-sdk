import type React from 'react';

export interface CreatifApp {
    logo: React.ReactNode;
    projectName: string;
    items: AppShellItem[];
}

export interface AppShellItem {
    menuText?: string;
    menuIcon?: React.ReactNode;
    structureName: string;
    structureType: StructureType;
    form: React.ReactNode;
}

export type StructureType = 'map' | 'list';
