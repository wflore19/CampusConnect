import { User, getUserById } from '@campusconnect/db';
import { LoaderFunction } from '@remix-run/node';
import { ensureUserAuthenticated, user } from '~/utils/session.server';

export const loader: LoaderFunction = async ({ request }) => {
    const session = await ensureUserAuthenticated(request);
    const userId = user(session);

    const loggedInUser: User = await getUserById(Number(userId));

    return true;
};
