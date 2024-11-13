import { Session, createCookieSessionStorage, redirect } from '@remix-run/node';
import { SESSION_SECRET } from './env';

// JSDocs for getSession, commitSession, and destroySession
/**
 * Get the session object from the request
 * @param request - The request object
 * @returns The session object
 */
/**
 * Commit the session object to the cookie
 * @param session - The session object
 * @returns The cookie string
 * @example
 * const cookieString = await commitSession(session);
 * response = new Response('Hello, world!', {
 *    headers: {
 *       'Set-Cookie': cookieString,
 *   },
 * });
 * return response;
 */
const {
    getSession: _getSession,
    commitSession,
    destroySession,
} = createCookieSessionStorage({
    cookie: {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365,
        name: '__session_campusconnect_member',
        secrets: [SESSION_SECRET!],
        secure: process.env.NODE_ENV === 'production',
    },
});

export { commitSession, destroySession };

export async function getSession(request: Request) {
    const cookieString = request.headers.get('Cookie');
    return _getSession(cookieString);
}

// Authentication
type EnsureUserAuthenticatedOptions = {
    redirectTo?: string;
};

/**
 * Ensure the user is authenticated
 * @param request - The request object
 * @param options - The options object
 * @returns The session object if the user is authenticated, otherwise redirects to the login page
 */
export async function ensureUserAuthenticated(
    request: Request,
    { redirectTo = '/login' }: EnsureUserAuthenticatedOptions = {}
): Promise<Session> {
    const session = await getSession(request);

    if (!session.has('user_id')) {
        throw redirect(redirectTo, {
            headers: {
                'Set-Cookie': await commitSession(session),
            },
        });
    }

    return session;
}

/**
 * Get the user ID from the session
 * @param session - The session object
 * @returns The user ID
 */
export function user(session: Session): string {
    return session.get('user_id');
}
