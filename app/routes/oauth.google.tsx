import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { commitSession, getSession } from '~/utils/session.server';
import { getGoogleUser, signToken } from '~/utils/auth';
import { db } from 'db/src';
import { uploadImageFromCDN } from '~/utils/s3-config.server';
import { APP_URL } from '~/utils/env';

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

        if (existingUser) {
            const authToken = signToken(
                { id: existingUser.id },
                { expiresIn: '1m' }
            );

            session.set('user_id', existingUser.id);

            const redirectUrl = new URL(`${APP_URL}/home`);
            redirectUrl.searchParams.set('token', authToken);

            return redirect(redirectUrl.toString(), {
                headers: {
                    'Set-Cookie': await commitSession(session),
                },
            });
        } else if (!existingUser) {
            const spacesImageUrl = await uploadImageFromCDN(
                googleUser.picture,
                `${googleUser.email}-${new Date()}.png`
            );

            if (!spacesImageUrl) {
                throw new Error('Failed to upload image');
            }

            const cdnSpacesImageUrl = spacesImageUrl.replace(
                'nyc3.digitaloceanspaces',
                'nyc3.cdn.digitaloceanspaces'
            );

            await db
                .insertInto('users')
                .values({
                    email: googleUser.email,
                    imageUrl: cdnSpacesImageUrl,
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

            const redirectUrl = new URL(`${APP_URL}/home`);

            return redirect(redirectUrl.toString(), {
                headers: {
                    'Set-Cookie': await commitSession(session),
                },
            });
        }
    } catch (e) {
        console.error(e);
        session.flash('error', (e as Error).message);
        return redirect('/login', {
            headers: {
                'Set-Cookie': await commitSession(session),
            },
        });
    }
};
