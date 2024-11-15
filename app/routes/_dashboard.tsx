import { LoaderFunction } from '@remix-run/node';
import { Dashboard } from '../components/dashboard';
import { Divider } from '../components/divider';
import { Outlet } from '@remix-run/react';
import { Calendar, Layers, User } from 'react-feather';
import { ensureUserAuthenticated, user } from '~/utils/session.server';
import { db } from 'db/src';

export const loader: LoaderFunction = async ({ request }) => {
    const session = await ensureUserAuthenticated(request);
    const id = user(session);

    const profile = await db
        .selectFrom('users')
        .select([
            'name',
            'email',
            'major',
            'year',
            'interests',
            'location',
            'imageUrl',
        ])
        .where('id', '=', id)
        .executeTakeFirst();

    return {
        name: profile?.name,
        email: profile?.email,
        major: profile?.major,
        year: profile?.year,
        interests: profile?.interests,
        location: profile?.location,
        imageUrl: profile?.imageUrl,
    }
};

export default function DashboardLayout() {
    return (
        <Dashboard>
            <Dashboard.Header />
            <Dashboard.Sidebar>
                <div className="mb-8 flex w-full items-center gap-1 p-6">
                    <Dashboard.CompanyLogo />
                    <div className="text-xl text-white">CampusConnect</div>
                </div>

                <Dashboard.Navigation>
                    <Dashboard.NavigationList>
                        <>
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
                                label="Friends"
                                pathname={'/friends'}
                            />

                            <div className="mb-2 mt-10">
                                <Divider />
                            </div>

                            <Dashboard.NavigationLink
                                icon={<User />}
                                label="Profile"
                                pathname={'/profile'}
                            />
                        </>
                    </Dashboard.NavigationList>
                </Dashboard.Navigation>

                <Dashboard.LogoutForm />
            </Dashboard.Sidebar>

            <Dashboard.Page className="overflow-auto">
                <Outlet />
            </Dashboard.Page>
        </Dashboard>
    );
}
