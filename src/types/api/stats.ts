export interface DashboardStat {
    structures: DashboardStructure[];
    versions: DashboardVersion[];
}

export interface DashboardVersion {
    id: string;
    name: string;
    createdAt: string;
}

export interface DashboardStructure {
    id: string;
    name: string;
    type: string;
    count: string;
    createdAt: string;
}
