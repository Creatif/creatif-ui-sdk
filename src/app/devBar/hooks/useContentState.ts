import { useState } from 'react';

export type ContentState = 'variables' | 'maps' | 'lists' | 'switchEnvironment' | 'help';

export default function useContentState() {
    const [state, setState] = useState<ContentState>('variables');

    return {
        state,
        changeState: (state: ContentState) => {
            setState(state);
        },
    };
}
