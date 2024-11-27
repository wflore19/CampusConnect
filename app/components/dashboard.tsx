import { Link, NavLink, Form } from '@remix-run/react';
import {
    Box,
    Flex,
    Button,
    Text,
    Separator,
    IconButton,
    Avatar,
    Tooltip,
} from '@radix-ui/themes';
import { Menu, X } from 'react-feather';
import React, { FC, PropsWithChildren, useState } from 'react';
import { useBodyScrollLock } from '~/hooks/useBodyScrollLock';
import {
    RiAppsFill,
    RiAppsLine,
    RiCalendarEventFill,
    RiCalendarEventLine,
    RiHome4Fill,
    RiHome4Line,
    RiLogoutBoxLine,
    RiTeamFill,
    RiTeamLine,
    RiUser3Fill,
    RiUser3Line,
} from '@remixicon/react';

const SIDEBAR_ITEMS = [
    {
        icon: <RiHome4Line size={20} />,
        activeIcon: <RiHome4Fill size={20} />,
        label: 'Home',
        path: '/home',
    },
    {
        icon: <RiAppsLine size={20} />,
        activeIcon: <RiAppsFill size={20} />,
        label: 'News Feed',
        path: '/feed',
    },
    {
        icon: <RiCalendarEventLine size={20} />,
        activeIcon: <RiCalendarEventFill size={20} />,
        label: 'Events',
        path: '/events',
    },
    {
        icon: <RiTeamLine size={20} />,
        activeIcon: <RiTeamFill size={20} />,
        label: 'Users',
        path: '/users',
    },
    {
        icon: <RiUser3Line size={20} />,
        activeIcon: <RiUser3Fill size={20} />,
        label: 'Profile',
        path: '/profile',
    },
];

interface NavItemProps {
    icon: JSX.Element;
    activeIcon: JSX.Element;
    label: string;
    path: string;
    showLabels: boolean;
    wrapper?: FC<{ children: JSX.Element }>;
}

interface LogoutButtonProps {
    showLabels: boolean;
    wrapper?: FC<{ children: JSX.Element }>;
}
interface Props {
    profilePicture: string;
}

interface SidebarContentProps {
    showLabels?: boolean;
}

interface DashboardContextType {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (value: boolean) => void;
}

export const DashboardContext = React.createContext<DashboardContextType>({
    isMobileMenuOpen: false,
    setIsMobileMenuOpen: () => {},
});

export function useDashboardContext() {
    const context = React.useContext(DashboardContext);
    if (context === undefined) {
        throw new Error(
            'useDashboardContext must be used within a DashboardProvider'
        );
    }
    return context;
}

export function Dashboard({
    children,
    profilePicture,
}: PropsWithChildren<Props>) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useBodyScrollLock(isMobileMenuOpen);

    return (
        <DashboardContext.Provider
            value={{ isMobileMenuOpen, setIsMobileMenuOpen }}
        >
            <Flex justify="center" style={{ width: '100%' }}>
                <Flex
                    style={{
                        maxWidth: '1200px',
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {/* Desktop Sidebar (full) */}
                    <Box
                        width="240px"
                        height="100vh"
                        position="absolute"
                        left="0"
                        top="0"
                        display={{ initial: 'none', lg: 'block' }}
                    >
                        <SidebarContent showLabels={true} />
                    </Box>

                    {/* Medium Devices Sidebar (icons only) */}
                    <Box
                        width="72px"
                        height="100vh"
                        position="absolute"
                        left="0"
                        top="0"
                        display={{ initial: 'none', sm: 'block', lg: 'none' }}
                    >
                        <SidebarContent showLabels={false} />
                    </Box>

                    {/* Main Content */}
                    <Box
                        width="100%"
                        pl={{ initial: '20px', sm: '72px', lg: '240px' }}
                        pr={{ initial: '20px' }}
                        mt={{ initial: '64px', sm: '0' }}
                    >
                        {children}
                    </Box>
                </Flex>

                {/* Mobile Menu Button */}
                <Box
                    position="fixed"
                    top="5"
                    px={'5'}
                    display={{ initial: 'block', sm: 'none' }}
                    width={'100%'}
                    style={{ zIndex: '2' }}
                >
                    <Flex justify={'between'} align={'center'}>
                        <IconButton
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            variant="soft"
                            size={'4'}
                        >
                            <Menu size={32} />
                        </IconButton>
                        <Box>
                            <Link to="/profile">
                                <Avatar
                                    size={'4'}
                                    src={profilePicture}
                                    fallback={''}
                                    radius="full"
                                />
                            </Link>
                        </Box>
                    </Flex>
                </Box>

                {/* Overlay for closing sidebar */}
                {isMobileMenuOpen && (
                    <Box
                        position="fixed"
                        top="0"
                        left="0"
                        right="0"
                        bottom="0"
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.15)',
                            zIndex: 2,
                        }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        display={{ initial: 'block', sm: 'none' }}
                    />
                )}

                {/* Mobile Sliding Drawer */}
                <Box
                    position="fixed"
                    top="0"
                    left="0"
                    bottom="0"
                    width="90%"
                    style={{
                        backgroundColor: 'var(--gray-1)',
                        transform: isMobileMenuOpen
                            ? 'translateX(0)'
                            : 'translateX(-100%)',
                        transition: 'transform 0.3s ease-in-out',
                        zIndex: '2',
                    }}
                    display={{ initial: 'block', sm: 'none' }}
                >
                    <SidebarContent showLabels={true} />
                </Box>
            </Flex>
        </DashboardContext.Provider>
    );
}

function SidebarContent({ showLabels = true }: SidebarContentProps) {
    const { isMobileMenuOpen, setIsMobileMenuOpen } = useDashboardContext();

    return (
        <Flex direction="column" p="4" height="100%">
            <Flex justify={'between'} align={'center'} mt={'4'}>
                <Link to="/">
                    <Flex align="center" gap="3">
                        <img
                            src="/images/logo.png"
                            alt="Campus Connect logo"
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: 'var(--radius-2)',
                            }}
                        />
                        {showLabels && (
                            <Text size="5" weight="bold">
                                CampusConnect
                            </Text>
                        )}
                    </Flex>
                </Link>
                <Box
                    display={{ initial: 'block', sm: 'none' }}
                    style={{ zIndex: '2' }}
                >
                    <IconButton
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        variant="soft"
                        size={'4'}
                    >
                        <X size={32} />
                    </IconButton>
                </Box>
            </Flex>
            <Separator size="4" my="4" />
            <Flex direction="column" gap="4">
                {SIDEBAR_ITEMS.map((item) => {
                    return showLabels ? (
                        <NavItem
                            key={item.path}
                            icon={item.icon}
                            activeIcon={item.activeIcon}
                            label={item.label}
                            path={item.path}
                            showLabels={showLabels}
                        />
                    ) : (
                        <NavItem
                            key={item.path}
                            icon={item.icon}
                            activeIcon={item.activeIcon}
                            label={item.label}
                            path={item.path}
                            showLabels={showLabels}
                            wrapper={({ children }) => (
                                <Tooltip content={item.label}>
                                    {children}
                                </Tooltip>
                            )}
                        />
                    );
                })}
            </Flex>
            <Separator size="4" my="4" />
            {showLabels ? (
                <LogoutButton showLabels={showLabels} />
            ) : (
                <LogoutButton
                    showLabels={showLabels}
                    wrapper={({ children }) => (
                        <Tooltip content="Logout">{children}</Tooltip>
                    )}
                />
            )}
        </Flex>
    );
}

function NavItem({
    icon,
    activeIcon,
    label,
    path,
    showLabels,
    wrapper: Wrapper = ({ children }) => (
        <React.Fragment>{children}</React.Fragment>
    ),
}: NavItemProps) {
    const { setIsMobileMenuOpen } = useDashboardContext();

    return (
        <Wrapper>
            <NavLink
                to={path}
                key={path}
                style={{
                    display: 'inline-block',
                    height: '2.5rem',
                }}
                onClick={() => setIsMobileMenuOpen(false)}
            >
                {({ isActive }) => (
                    <Button
                        variant={'soft'}
                        color={isActive ? undefined : 'gray'}
                        style={{
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer',
                        }}
                        radius="full"
                    >
                        <Flex
                            justify="start"
                            align="center"
                            gap="2"
                            width={'100%'}
                        >
                            {isActive ? activeIcon : icon}
                            {showLabels && <Text>{label}</Text>}
                        </Flex>
                    </Button>
                )}
            </NavLink>
        </Wrapper>
    );
}

function LogoutButton({
    showLabels,
    wrapper: Wrapper = ({ children }) => (
        <React.Fragment>{children}</React.Fragment>
    ),
}: LogoutButtonProps) {
    return (
        <Wrapper>
            <Form action="/logout" method="post">
                <Button
                    type="submit"
                    variant="outline"
                    style={{
                        width: '100%',
                        height: '2.5rem',
                    }}
                    radius="full"
                >
                    <Flex justify="start" align="center" gap="2" width={'100%'}>
                        <RiLogoutBoxLine size={20} />
                        {showLabels && <Text>Logout</Text>}
                    </Flex>
                </Button>
            </Form>
        </Wrapper>
    );
}
