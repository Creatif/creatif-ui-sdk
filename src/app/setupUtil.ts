import type { CreatifApp } from '@root/types/shell/shell';

export function validateConfig(app: CreatifApp): string[] {
    const messages: string[] = [];
    if (!app) {
        messages.push('App config does not exist. Your application cannot be created without configuration.');
        return messages;
    }

    if (typeof app.projectName !== 'string' || !app.projectName) {
        messages.push('Invalid project name. Project name must be a string');
        return messages;
    }

    if (!Array.isArray(app.items)) {
        messages.push('App config does not have \'config.items\'. It must be an array of of structures.');
        return messages;
    }

    if (app.items.length === 0) {
        messages.push('App config \'config.items\' is empty. It must be an array of of structures.');
        return messages;
    }

    const structures = [];
    for (const item of app.items) {
        if (item.menuText && typeof item.menuText !== 'string') {
            messages.push('Config item \'config.item.menuText\' is invalid. It must be a string.');
        }

        if (typeof item.structureName !== 'string' || !item.structureName) {
            messages.push('Config item \'config.item.structureName\' is invalid. It must be a string.');
        }

        if (typeof item.structureType !== 'string' || !item.structureType) {
            messages.push('Config item \'config.item.structureType\' is invalid. It must be a string.');
        }

        structures.push({
            name: item.structureName,
            type: item.structureType,
        });

        if (!item.form) {
            ('Config item \'config.item.form\' is invalid. It must be a valid React component.');
        }
    }

    const currentLists = structures.filter((item) => item.type === 'list').map((item) => item.name);

    if (currentLists.length !== Array.from(new Set(currentLists)).length) {
        messages.push(
            `Some of the 'list' type items have duplicate names. Every list must have a unique name. Provided lists are ${currentLists.join(
                ', ',
            )}`,
        );
    }

    const currentMaps = structures.filter((item) => item.type === 'map').map((item) => item.name);

    if (currentMaps.length !== Array.from(new Set(currentMaps)).length) {
        messages.push(
            `Some of the 'list' type items have duplicate names. Every list must have a unique name. Provided lists are ${currentLists.join(
                ', ',
            )}`,
        );
    }

    return messages;
}
