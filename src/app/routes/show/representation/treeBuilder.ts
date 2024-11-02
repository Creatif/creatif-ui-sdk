type nodeType = 'root' | 'boolean' | 'array' | 'object' | 'string' | 'number';

export interface Node {
    name: string;
    data: unknown;
    type: nodeType;
    isExpandable?: boolean;
    level: number;
    child: unknown | null;
    children: Node[] | null;
}

export interface Root {
    type: 'root';
    level: number;
    children: Node[];
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

export function treeBuilder(values: object[] | undefined): Root {
    const root: Root = {
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

        if (Array.isArray(value)) {
            root.children.push(
                recursiveTreeBuilder(newNode(name, value, 'array', root.level), 'array', root.level + 1),
            );
        }

        if (typeof value === 'object' && !Array.isArray(value)) {
            root.children.push(
                recursiveTreeBuilder(newNode(name, value, 'array', root.level), 'array', root.level + 1),
            );
        }
    }

    return root;
}

function recursiveTreeBuilder(parent: Node, nodeType: nodeType, level: number): Node {
    if (nodeType === 'array' && Array.isArray(parent.data)) {
        parent.children = [];
        for (const column of parent.data) {
            if (Number.isInteger(column) || isFloat(column)) {
                parent.children.push(newNode(parent.name, column.value, 'number', parent.level + 1));
            }

            if (typeof column === 'boolean') {
                parent.children.push(newNode(parent.name, column, 'boolean', parent.level + 1));
            }

            if (typeof column === 'string') {
                parent.children.push(newNode(parent.name, column, 'string', parent.level + 1));
            }

            if (typeof column === 'object' && !Array.isArray(column)) {
                console.log('is object: ', parent.name, column, level);
                parent.children.push(
                    recursiveTreeBuilder(newNode(parent.name, column, 'object', level + 1), 'object', level + 1),
                );
            }

            if (Array.isArray(column)) {
                console.log('is array: ', parent.name, column, level);
                parent.children.push(
                    recursiveTreeBuilder(newNode(parent.name, column, 'array', level + 1), 'array', level + 1),
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

            if (Array.isArray(value)) {
                parent.children.push(recursiveTreeBuilder(newNode(name, value, 'array', level), 'array', level + 1));
            }

            if (typeof value === 'object' && !Array.isArray(value)) {
                parent.children.push(recursiveTreeBuilder(newNode(name, value, 'array', level), 'array', level + 1));
            }
        }
    }

    return parent;
}
