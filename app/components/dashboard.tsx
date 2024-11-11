import {
  Link,
  type LinkProps,
  NavLink,
} from '@remix-run/react';
import React, {
  type PropsWithChildren,
  useContext,
  useState,
} from 'react';
import { LogOut, Menu, X } from 'react-feather';

import { IconButton } from './icon-button';
import { Text } from './text';
import { cx } from '../utils/cx';

type DashboardContextValue = {
  open: boolean;
  setOpen(open: boolean): void;
};

const DashboardContext = React.createContext<DashboardContextValue>({
  open: false,
  setOpen: () => {},
});


export const Dashboard = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <DashboardContext.Provider value={{ open, setOpen }}>
      <main>{children}</main>
    </DashboardContext.Provider>
  );
};

Dashboard.CloseMenuButton = function CloseMenuButton() {
  const { setOpen } = useContext(DashboardContext);

  function onClick() {
    setOpen(false);
  }

  return (
    <div className="md:hidden">
      <IconButton
        backgroundColorOnHover="gray-100"
        icon={<X />}
        onClick={onClick}
        shape="circle"
      />
    </div>
  );
};

Dashboard.CompanyLogo = function CompanyLogo() {
  return (
    <Link to="/" className="flex items-center gap-1">
      <img 
        alt="Company Logo" 
        src="/images/logo.png" 
        className="h-8 w-auto"
      />
      <h1 className="text-xl font-bold text-gray-900">CampusConnect</h1>
    </Link>
  );
};

const itemClassName = cx(
  'box-border flex w-full items-center gap-3 rounded-lg p-4',
  'bg-white transition-all duration-200',
  'hover:bg-blue-50',
  'aria-[current="page"]:bg-blue-100 aria-[current="page"]:border-l-4 aria-[current="page"]:border-blue-600',
  'aria-[current="page"]:hover:bg-blue-200'
);

Dashboard.LogoutForm = function LogoutForm() {
  return (
      <Link to="/" className={cx(itemClassName, 'hover:text-red', 'mt-auto w-full')} type="submit">
        <LogOut />
        Log Out
      </Link>
  );
};

Dashboard.MenuButton = function MenuButton() {
  const { setOpen } = useContext(DashboardContext);

  function onClick() {
    setOpen(true);
  }

  return (
    <IconButton
      backgroundColorOnHover="gray-100"
      className="flex h-fit w-fit md:hidden"
      icon={<Menu />}
      onClick={onClick}
      shape="circle"
    />
  );
};

Dashboard.Navigation = function Navigation({ children }: PropsWithChildren) {
  return <nav className="w-full">{children}</nav>;
};

type DashboardNavigationLinkProps = {
  icon: JSX.Element;
  label: string;
  pathname: string;
  prefetch?: LinkProps['prefetch'];
};

Dashboard.NavigationLink = function NavigationLink({
  icon,
  label,
  pathname,
  prefetch,
}: DashboardNavigationLinkProps) {
  const { setOpen } = useContext(DashboardContext);

  function onClick() {
    setOpen(false);
  }

  return (
    <li>
      <NavLink
        className={itemClassName}
        onClick={onClick}
        prefetch={prefetch}
        to={pathname}
      >
        {icon} {label}
      </NavLink>
    </li>
  );
};

Dashboard.NavigationList = function NavigationList({
  children,
}: PropsWithChildren) {
  return <ul className="flex flex-col">{children}</ul>;
};

Dashboard.Page = function Page({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <section
      className={cx(
        '@container box-border flex min-h-screen flex-col gap-4',
        'p-4 pb-24',
        'md:ml-[270px] md:p-6 md:pb-16',
        className
      )}
    >
      {children}
    </section>
  );
};


Dashboard.Sidebar = function Sidebar({ children }: PropsWithChildren) {
  const { open } = useContext(DashboardContext);

  return (
    <aside
      className={cx(
        'fixed left-0 h-screen w-[270px] flex-col items-start gap-4 overflow-auto border-r border-r-gray-200 p-6',
        'md:flex',
        open
          ? 'z-10 flex w-[calc(100%-4rem)] animate-[slide-from-left_300ms] bg-white md:hidden'
          : 'hidden'
      )}
    >
      {children}
    </aside>
  );
};

Dashboard.Subheader = function Subheader({ children }: PropsWithChildren) {
  return <div className="flex justify-between gap-4">{children}</div>;
};

Dashboard.Title = function Title({ children }: PropsWithChildren) {
  return <Text variant="2xl">{children}</Text>;
};

Dashboard.Header = function Header() {
  const { open } = useContext(DashboardContext);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 md:hidden">
      <div className="flex items-center justify-between">
        {open ? 
        <Dashboard.CloseMenuButton /> :
        <Dashboard.MenuButton /> 
        }
      </div>
    </header>
  );
};
