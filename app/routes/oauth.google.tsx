import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { commitSession, getSession } from '~/utils/session.server';
import { getGoogleUser, signToken } from '~/utils/auth';
import { db } from 'db/src';

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

        if (!googleUser) {
            throw new Error('Failed to get Google user');
        }

        const existingUser = await db
            .selectFrom('users')
            .selectAll()
            .where('email', '=', googleUser.email)
            .executeTakeFirst();
        console.log(existingUser, '🐞');

        if (existingUser) {
            const authToken = signToken(
                { id: existingUser.id },
                { expiresIn: '1m' }
            );

            session.set('user_id', existingUser.id);

            const url = new URL(session.get('redirect_url') || '/home');
            url.searchParams.set('token', authToken);
            console.log(url, '🪲');

            return redirect(url.toString(), {
                headers: {
                    'Set-Cookie': await commitSession(session),
                },
            });
        } else if (!existingUser) {
            await db
                .insertInto('users')
                .values({
                    email: googleUser.email,
                    imageUrl: googleUser.picture,
                    interests: [],
                    location: '',
                    major: '',
                    name: googleUser.name,
                    year: '',
                })
                .executeTakeFirst();

            const newUser = await db
                .selectFrom('users')
                .select(['id'])
                .where('email', '=', googleUser.email)
                .executeTakeFirst();

            if (!newUser) {
                throw new Error('Failed to create new user');
            }

            session.set('user_id', newUser.id);

            const redirectUrl = session.get('redirect_url') || '/home';

            return redirect(redirectUrl, {
                headers: {
                    'Set-Cookie': await commitSession(session),
                },
            });
        }
    } catch (e) {
        session.flash('error', (e as Error).message);
        return redirect('/login', {
            headers: {
                'Set-Cookie': await commitSession(session),
            },
        });
    }
};