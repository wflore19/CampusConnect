import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { db } from 'db/src';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { getGoogleAuthURL } from '~/utils/auth';
import { getSession, user } from '~/utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);

    if (!session.has('user_id')) {
        return { googleAuthUrl: getGoogleAuthURL() };
    }

    const id = await user(session);
    const profile = await db
        .selectFrom('users')
        .select(['firstName', 'lastName', 'profilePicture'])
        .where('id', '=', id)
        .executeTakeFirst();

    return {
        firstName: profile?.firstName,
        profilePicture: profile?.profilePicture,
    };
}

export default function PublicLayout() {
    const { firstName, profilePicture } = useLoaderData<typeof loader>();

    return (
        <div className="flex min-h-screen flex-col bg-white text-gray-800">
            <Header firstName={firstName} imageUrl={profilePicture} />
            <Outlet />
            <Footer />
        </div>
    );
}
