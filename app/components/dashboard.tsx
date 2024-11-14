import {
    Link,
    type LinkProps,
    NavLink,
    Form as RemixForm,
} from '@remix-run/react';
import React, { type PropsWithChildren, useContext, useState } from 'react';
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
                className="text-white"
                icon={<X />}
                onClick={onClick}
                shape="circle"
            />
        </div>
    );
};

Dashboard.CompanyLogo = function CompanyLogo() {
    return (
        <Link to="/" className="flex items-center gap-1 p-6">
            <img
                alt="Company Logo"
                src="/images/logo.png"
                className="h-8 w-auto"
            />
        </Link>
    );
};

const itemClassName = cx(
    'box-border flex w-full items-center gap-3 p-4',
    'transition-all duration-200',
    'hover:bg-blue-100 hover:text-black',
    'aria-[current="page"]:border-l-4 aria-[current="page"]:bg-blue-600 aria-[current="page"]:hover:text-white'
);

Dashboard.LogoutForm = function LogoutForm() {
    return (
        <RemixForm action="/logout" className="mt-auto w-full" method="post">
            <button
                className={cx(itemClassName, 'hover:text-black')}
                type="submit"
            >
                <LogOut />
                Log Out
            </button>
        </RemixForm>
    );
};

Dashboard.MenuButton = function MenuButton() {
    const { setOpen } = useContext(DashboardContext);

    function onClick() {
        setOpen(true);
    }

    return (
        <IconButton
            className="flex h-fit w-fit text-white md:hidden"
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
                'fixed left-0 min-h-[calc(100%-65px)] w-0 flex-col items-start gap-4 overflow-auto md:w-[270px]',
                'border-r border-r-gray-200 bg-blue-900 text-white md:flex md:min-h-screen',
                'transition-all ease-in-out',
                open
                    ? 'z-10 flex w-[calc(100%-4rem)] animate-[slide-from-left_300ms] duration-300 md:hidden'
                    : 'w-[0px] duration-200'
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
        <header className="sticky top-0 z-10 border-b border-gray-100 border-opacity-25 bg-blue-900 p-4 md:hidden">
            <div className="flex items-center justify-between">
                {open ? (
                    <Dashboard.CloseMenuButton />
                ) : (
                    <Dashboard.MenuButton />
                )}
            </div>
        </header>
    );
};
