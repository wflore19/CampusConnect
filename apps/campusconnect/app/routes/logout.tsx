import { type ActionFunctionArgs, redirect } from '@remix-run/node';

import { destroySession, getSession } from '~/utils/session.server';

export async function action({ request }: ActionFunctionArgs) {
    const session = await getSession(request);

    return redirect('/login', {
        headers: {
            'Set-Cookie': await destroySession(session),
        },
    });
}
