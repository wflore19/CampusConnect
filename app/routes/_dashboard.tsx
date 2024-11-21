// app/routes/_dashboard.tsx
import { LoaderFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { Dashboard } from '~/components/dashboard';
import { ensureUserAuthenticated, user } from '~/utils/session.server';
import { db } from 'db/src';
import { Box, Container } from '@radix-ui/themes';

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
    return (
        <Box style={{ maxWidth: '1300px', margin: '0 auto', width: '100%' }}>
            <Dashboard>
                <Container size="3">
                    <Box py="6">
                        <Outlet />
                    </Box>
                </Container>
            </Dashboard>
        </Box>
    );
}
