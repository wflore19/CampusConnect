import {
    type ActionFunctionArgs,
    type LoaderFunctionArgs,
    redirect,
} from '@remix-run/node';

import {
    destroySession,
    ensureUserAuthenticated,
    getSession,
} from '~/utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
    await ensureUserAuthenticated(request);
}

export async function action({ request }: ActionFunctionArgs) {
    const session = await getSession(request);

    return redirect('/login', {
        headers: {
            'Set-Cookie': await destroySession(session),
        },
    });
}
