import { Dashboard } from '../components/dashboard';
import { Divider } from '../components/divider'
import { Outlet } from '@remix-run/react';
import {
  Calendar,
  Layers,
  User,
} from 'react-feather';

export default function DashboardLayout() {

  return (
    <Dashboard>
      <Dashboard.Header />
      <Dashboard.Sidebar>
        <div className="mb-8 flex w-full items-center justify-between">
          <Dashboard.CompanyLogo />
        </div>

        <Dashboard.Navigation>
          <Dashboard.NavigationList>
              <>
                <div className="my-2">
                  <Divider />
                </div>
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
