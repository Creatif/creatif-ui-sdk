import type { VisitingActivity } from '@root/types/api/activity';
import addActivity from '@lib/api/activity/addActivity';
import { Runtime } from '@app/systems/runtime/Runtime';

export function useAddActivity() {
    return {
        addVisitingActivity: (activity: VisitingActivity) => {
            addActivity({
                projectId: Runtime.instance.currentProjectCache.getProject().id,
                data: JSON.stringify(activity),
            });
        },
    };
}
