import { LoaderFunction } from '@remix-run/node';
import { Dashboard } from '../components/dashboard';
import { Divider } from '../components/divider';
import { Outlet } from '@remix-run/react';
import { Calendar, Layers, User, Users } from 'react-feather';
import { ensureUserAuthenticated, user } from '~/utils/session.server';
import { db } from 'db/src';
import { Box } from '@radix-ui/themes';

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
        <Dashboard>
            <Dashboard.Header />
            <Dashboard.Sidebar>
                <Box className="mb-8 flex w-full items-center gap-1 p-6">
                    <Dashboard.CompanyLogo />
                </Box>

                <Dashboard.Navigation>
                    <Dashboard.NavigationList>
                        <Dashboard.NavigationLink
                            icon={<Layers />}
                            label={`Home`}
                            pathname={'/home'}
                        />
                        <Dashboard.NavigationLink
                            icon={<Calendar />}
                            label="Events"
                            pathname={'/events'}
                        />
                        <Dashboard.NavigationLink
                            icon={<User />}
                            label="Users"
                            pathname={'/users'}
                        />
                        <Dashboard.NavigationLink
                            icon={<Users />}
                            label="Friends"
                            pathname={'/friends'}
                        />
                        <Dashboard.NavigationLink
                            icon={<User />}
                            label="Profile"
                            pathname={'/profile'}
                        />

                        <div className="mb-2 mt-10">
                            <Divider />
                        </div>
                        <Dashboard.LogoutForm />
                    </Dashboard.NavigationList>
                </Dashboard.Navigation>
            </Dashboard.Sidebar>

            <Dashboard.Page className="overflow-auto">
                <Outlet />
            </Dashboard.Page>
        </Dashboard>
    );
}
