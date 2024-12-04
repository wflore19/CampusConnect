import { getUserByEmail } from '@campusconnect/db';
import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import {
    exchangeCodeForToken,
    getGoogleProfileInformation,
    signupNewUser,
    loginUser,
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
        const { accessToken, refreshToken } = await exchangeCodeForToken(code);
        const googleUserInformation = await getGoogleProfileInformation(
            accessToken,
            refreshToken
        );

        const user = await getUserByEmail(googleUserInformation.email);

        if (!user) return signupNewUser(googleUserInformation, session);

        return loginUser(Number(user.id), session);
    } catch (error) {
        console.log(error);
        throw redirect('/login');
    }
};
