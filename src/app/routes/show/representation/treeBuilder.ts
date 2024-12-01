type nodeType = 'root' | 'boolean' | 'array' | 'object' | 'string' | 'number' | 'undefined' | 'null';

export interface TreeBuilderNode {
    name: string;
    data: unknown;
    type: nodeType;
    isExpandable?: boolean;
    level: number;
    child: unknown | null;
    children: TreeBuilderNode[] | null;
}

export interface TreeBuilderRoot {
    type: 'root';
    level: number;
    children: TreeBuilderNode[];
}

function newNode(name: string, data: unknown, type: nodeType, level: number) {
    return {
        name: name,
        data: data,
        type: type,
        child: null,
        children: null,
        level: level,
    };
}

function isFloat(n: unknown) {
    return Number(n) === n && n % 1 !== 0;
}

export function treeBuilder(values: object | undefined): TreeBuilderRoot {
    const root: TreeBuilderRoot = {
        type: 'root',
        children: [],
        level: 0,
    };

    if (!values) {
        return root;
    }

    const objectArray = Object.entries(values);

    for (const column of objectArray) {
        const name = column[0];
        const value = column[1];

        if (Number.isInteger(value) || isFloat(value)) {
            root.children.push(newNode(name, value, 'number', root.level));
        }

        if (typeof value === 'boolean') {
            root.children.push(newNode(name, value, 'boolean', root.level));
        }

        if (typeof value === 'string') {
            root.children.push(newNode(name, value, 'string', root.level));
        }

        // value is null or undefined
        if (value === null) {
            root.children.push(newNode(name, value, 'null', root.level));
        }

        if (typeof value === 'undefined') {
            root.children.push(newNode(name, value, 'undefined', root.level));
        }

        if (value && Array.isArray(value)) {
            root.children.push(
                recursiveTreeBuilder(newNode(name, value, 'array', root.level), 'array', root.level + 1),
            );
        }

        if (value && typeof value === 'object' && !Array.isArray(value)) {
            root.children.push(
                recursiveTreeBuilder(newNode(name, value, 'object', root.level), 'object', root.level + 1),
            );
        }
    }

    return root;
}

function recursiveTreeBuilder(parent: TreeBuilderNode, nodeType: nodeType, level: number): TreeBuilderNode {
    if (nodeType === 'array' && Array.isArray(parent.data)) {
        parent.children = [];

        for (let i = 0; i < parent.data.length; i++) {
            const column = parent.data[i];
            if (Number.isInteger(column) || isFloat(column)) {
                parent.children.push(newNode(parent.name, column.value, 'number', parent.level + 1));
            }

            if (typeof column === 'boolean') {
                parent.children.push(newNode(parent.name, column, 'boolean', parent.level + 1));
            }

            if (typeof column === 'string') {
                parent.children.push(newNode(parent.name, column, 'string', parent.level + 1));
            }

            // value is null or undefined
            if (column === null) {
                parent.children.push(newNode(parent.name, column, 'null', parent.level + 1));
            }

            if (typeof column === 'undefined') {
                parent.children.push(newNode(parent.name, column, 'undefined', parent.level + 1));
            }

            if (typeof column === 'object' && !Array.isArray(column)) {
                parent.children.push(
                    recursiveTreeBuilder(
                        newNode(`${parent.name}[${i}]`, column, 'object', parent.level + 1),
                        'object',
                        level + 1,
                    ),
                );
            }

            if (Array.isArray(column)) {
                parent.children.push(
                    recursiveTreeBuilder(
                        newNode(parent.name, column, 'array', parent.level + 1),
                        'array',
                        parent.level + 1,
                    ),
                );
            }
        }
    }

    if (nodeType === 'object' && typeof parent.data === 'object' && !Array.isArray(parent.data)) {
        const objectArray = Object.entries(parent.data as object);
        parent.children = [];

        for (const column of objectArray) {
            const name = column[0];
            const value = column[1];

            if (Number.isInteger(value) || isFloat(value)) {
                parent.children.push(newNode(name, value, 'number', level));
            }

            if (typeof value === 'boolean') {
                parent.children.push(newNode(name, value, 'boolean', level));
            }

            if (typeof value === 'string') {
                parent.children.push(newNode(name, value, 'string', level));
            }

            // value is null or undefined
            if (value === null) {
                parent.children.push(newNode(name, value, 'null', level));
            }

            if (typeof value === 'undefined') {
                parent.children.push(newNode(name, value, 'undefined', level));
            }

            if (Array.isArray(value)) {
                parent.children.push(recursiveTreeBuilder(newNode(name, value, 'array', level), 'array', level + 1));
            }

            if (typeof value === 'object' && !Array.isArray(value)) {
                parent.children.push(recursiveTreeBuilder(newNode(name, value, 'object', level), 'object', level + 1));
            }
        }
    }

    return parent;
}
