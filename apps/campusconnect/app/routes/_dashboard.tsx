import { LoaderFunction, MetaFunction } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { Dashboard } from '~/components/dashboard';
import { ensureUserAuthenticated, user } from '~/utils/session.server';
import { User, getUserById } from '@campusconnect/db';
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
    const userId = user(session);

    const loggedInUser: User = await getUserById(Number(userId));

    return loggedInUser;
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
