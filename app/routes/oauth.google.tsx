import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import {
    findUserByEmail,
    getGoogleUser,
    loginExistingUser,
    signupNewUser,
} from '~/utils/auth';
import { getSession } from '~/utils/session.server';

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const session = await getSession(request);

    if (!code) {
        session.flash('error', 'Google did not return a code');
        return redirect('/login');
    }

    try {
        const googleUser = await getGoogleUser(code);

        const existingUser = await findUserByEmail(googleUser.email);

        if (!existingUser) return signupNewUser(googleUser, session);

        return loginExistingUser(existingUser, session);
    } catch (error) {
        throw new Error((error as Error).message);
    }
};
