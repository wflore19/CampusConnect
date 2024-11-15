import {
    Links,
    Meta,
    Outlet,
    Scripts,
    useLoaderData,
    useLocation,
} from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import { GOOGLE_ANALYTICS } from './utils/env';

import './tailwind.css';
import { useEffect } from 'react';
import { GoogleAnalytics } from './components/google-analytics';

export const links: LinksFunction = () => [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
    },
    {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
    },
];

export async function loader() {
    if (!GOOGLE_ANALYTICS) return { GOOGLE_ANALYTICS: '_' };

    return { GOOGLE_ANALYTICS };
}

export function Layout({ children }: { children: React.ReactNode }) {
    const { GOOGLE_ANALYTICS } = useLoaderData<typeof loader>();

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" sizes="16x16 32x32" type="image/x-icon" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" type="image/png" />
                <link rel="manifest" href="/site.webmanifest" />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <Scripts />
                <GoogleAnalytics GoogleAnalyticsId={GOOGLE_ANALYTICS} />
            </body>
        </html>
    );
}

export default function App() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return <Outlet />;
}
