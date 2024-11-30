import { LoaderFunction, MetaFunction } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { Dashboard } from '~/components/dashboard';
import { ensureUserAuthenticated, user } from '~/utils/session.server';
import { db } from '@campusconnect/db';
import { Box, Container } from '@radix-ui/themes';
import { SocketProvider } from '~/utils/socket';
import { NotificationProvider } from '~/modules/notifications/notifications.context';

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
        userId: id,
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        email: profile?.email,
        profilePicture: profile?.profilePicture,
    };
};

export default function DashboardLayout() {
    const { profilePicture, userId } = useLoaderData<typeof loader>();
    return (
        <div className="htmlRoot">
            <Box width={'full'} maxWidth={'1300px'} mx={'auto'}>
                <SocketProvider userId={userId}>
                    <NotificationProvider userId={userId}>
                        <Dashboard profilePicture={profilePicture}>
                            <Container size="3" p={{ initial: '1', md: '6' }}>
                                <Box py="6">
                                    <Outlet />
                                </Box>
                            </Container>
                        </Dashboard>
                    </NotificationProvider>
                </SocketProvider>
            </Box>
        </div>
    );
}
