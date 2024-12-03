import React from 'react';

/**
 * This hook helps determine if the client-side JavaScript has been fully
 * loaded and hydrated with the server-rendered content. It's particularly
 * useful for handling functionality that should only run on the client side
 * or for preventing hydration mismatches.
 *
 * @returns {boolean} Returns true when the component is hydrated on the client side,
 *                    false during server-side rendering or before hydration is complete.
 */
export const useHydrated = () => {
    const [hydrated, setHydrated] = React.useState(false);
    React.useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        setHydrated(false);
        setHydrated(true);
    }, []);
    return hydrated;
};
