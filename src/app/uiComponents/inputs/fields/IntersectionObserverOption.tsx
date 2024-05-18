import { useCallback, useEffect, useRef } from 'react';

interface Props {
    onIntersected: () => void;
    rootElem: HTMLDivElement;
    isFinal: boolean;
}

export function IntersectionObserverOption({ onIntersected, rootElem, isFinal }: Props) {
    const ref = useRef<HTMLSpanElement | null>(null);
    const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                onIntersected();
            }
        });
    }, []);

    useEffect(() => {
        if (isFinal) return;

        let observer: IntersectionObserver | undefined = undefined;
        if (ref.current) {
            const options = {
                root: rootElem,
                rootMargin: '0px',
                threshold: 1.0,
            };

            observer = new IntersectionObserver(handleIntersect, options);
            observer.observe(ref.current);
        }

        return () => {
            if (observer) observer.disconnect();
        };
    }, []);

    return <span ref={ref} />;
}
