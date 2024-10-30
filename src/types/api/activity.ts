export interface ActivityRequestBlueprint {
    projectId: string;
    data: string;
}

export interface Activity<Data> {
    id: string;
    data: Data;
    createdAt: string;
}

export interface BaseActivity {
    type: ActivityType;
}

export interface VisitingActivity extends BaseActivity {
    subType?: string;
    path: string;
    title: string;
    description?: string;
}

export type ActivityTypes = VisitingActivity;
export type ActivityType = 'visit';
