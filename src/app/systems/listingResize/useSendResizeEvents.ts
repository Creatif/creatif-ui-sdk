import { useEffect } from 'react';
import { createContentResizeEvent } from '@app/systems/listingResize/contentResizeEvent';

/**
 * Why?
 *
 * The uiComponent/lists/Listing.tsx component just couldn't be created with media queries. This hook is used in
 * RouterOutlet component to get the size of the underlying container of the actual Listing listing.
 * When the size is gotten, the size is observer in uiComponents/lists/Listing.tsx
 * @param element
 */
export function useSendResizeEvents(element: HTMLDivElement | null) {
    const useContentCreateEvent = createContentResizeEvent(element?.offsetWidth || 1280);
    const setSize = useContentCreateEvent((state) => state.setSize);

    useEffect(() => {
        let resizeObserver: ResizeObserver | null = null;

        if (element) {
            const resizeObserver = new ResizeObserver((entries) => {
                requestAnimationFrame(() => {
                    for (const entry of entries) {
                        if (entry.borderBoxSize.length !== 0) {
                            const inlineSize = entry.target.clientWidth;
                            if (inlineSize < 1280) {
                                setSize(inlineSize);
                            }
                        }
                    }
                });
            });

            resizeObserver.observe(element);
        }

        return () => {
            if (resizeObserver && element) {
                resizeObserver.unobserve(element);
                resizeObserver = null;
            }
        };
    }, [element]);
}
