import { Runtime } from '@lib/publicApi/lib/runtime';

export function initialize(projectId: string) {
    Runtime.init(projectId);
}
