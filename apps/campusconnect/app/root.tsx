import { Links, Meta, Outlet, Scripts } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';

import './tailwind.css';
import '@radix-ui/themes/styles.css';
import { GoogleAnalytics } from './components/google-analytics';
import { Theme } from '@radix-ui/themes';

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

export default function App() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <Theme accentColor="indigo" radius="medium">
                    <Outlet />
                    {/* <ThemePanel /> */}
                </Theme>
                <Scripts />
                <GoogleAnalytics />
            </body>
        </html>
    );
}
