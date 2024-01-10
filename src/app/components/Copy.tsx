import { IconCheck, IconCopy } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface Props {
    onClick: () => void;
}

export default function Copy({ onClick }: Props) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, 5000);
        }
    }, [copied]);

    return (
        <>
            {!copied && (
                <IconCopy
                    style={{
                        cursor: 'pointer',
                    }}
                    size={18}
                    onClick={() => {
                        setCopied(true);
                        onClick();
                    }}
                />
            )}
            {copied && <IconCheck size={18} />}
        </>
    );
}
