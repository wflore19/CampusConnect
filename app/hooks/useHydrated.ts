import React from "react";

export const useHydrated = () => {
    const [hydrated, setHydrated] = React.useState(false);
    React.useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        setHydrated(false);
        setHydrated(true);
    }, []);
    return hydrated;
};
