import { LoaderFunction, MetaFunction } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { Dashboard } from '~/components/dashboard';
import { ensureUserAuthenticated, user } from '~/utils/session.server';
import { db } from 'db/src';
import { Box, Container } from '@radix-ui/themes';

export const meta: MetaFunction = () => {
    return [
        { title: 'CampusConnect - Your Campus Community' },
        {
            name: 'description',
            content:
                'Connect with friends, discover events, and build your campus community',
        },
    ];
};

export const loader: LoaderFunction = async ({ request }) => {
    const session = await ensureUserAuthenticated(request);
    const id = user(session);

    const profile = await db
        .selectFrom('users')
        .select(['firstName', 'lastName', 'email', 'profilePicture'])
        .where('id', '=', id)
        .executeTakeFirst();

    return {
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        email: profile?.email,
        profilePicture: profile?.profilePicture,
    };
};

export default function DashboardLayout() {
    const { profilePicture } = useLoaderData<typeof loader>();
    return (
        <div className="htmlRoot">
            <Box width={'full'} maxWidth={'1300px'} mx={'auto'}>
                <Dashboard profilePicture={profilePicture}>
                    <Container size="3" p={{ initial: '1', md: '6' }}>
                        <Box py="6">
                            <Outlet />
                        </Box>
                    </Container>
                </Dashboard>
            </Box>
        </div>
    );
}
