import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Runtime } from '@app/systems/runtime/Runtime';

export function NoMatchRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate(Runtime.instance.rootPath());
    }, []);

    return null;
}
