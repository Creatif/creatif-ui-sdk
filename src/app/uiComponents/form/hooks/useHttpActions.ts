import type { StructureType } from '@root/types/shell/shell';
import { addToList } from '@lib/api/declarations/lists/addToList';
import { updateListItem } from '@lib/api/declarations/lists/updateListItem';
import addToMap from '@lib/api/declarations/maps/addToMap';
import { updateMapVariable } from '@lib/api/declarations/maps/updateMapVariable';

export function useHttpActions(structureType: StructureType) {
    if (structureType === 'list') {
        return {
            add() {
                return addToList;
            },
            update() {
                return updateListItem;
            },
        };
    }

    if (structureType === 'map') {
        return {
            add() {
                return addToMap;
            },
            update() {
                return updateMapVariable;
            },
        };
    }

    return {};
}
