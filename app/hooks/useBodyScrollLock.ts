// app/hooks/useBodyScrollLock.ts
import { useEffect } from 'react';

export function useBodyScrollLock(isLocked: boolean) {
    useEffect(() => {
        if (typeof document === 'undefined') return;

        const scrollBarWidth =
            window.innerWidth - document.documentElement.clientWidth;

        if (isLocked) {
            document.body.style.setProperty(
                '--scrollbar-width',
                `${scrollBarWidth}px`
            );
            document.body.classList.add('scroll-locked');
        } else {
            document.body.classList.remove('scroll-locked');
        }

        return () => {
            document.body.classList.remove('scroll-locked');
            document.body.style.removeProperty('--scrollbar-width');
        };
    }, [isLocked]);
}
