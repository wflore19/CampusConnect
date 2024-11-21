import { Link, NavLink, Form } from '@remix-run/react';
import {
    Box,
    Flex,
    Button,
    Text,
    Separator,
    IconButton,
} from '@radix-ui/themes';
import { Layers, Calendar, User, Users, LogOut, Menu, X } from 'react-feather';
import { FC, PropsWithChildren, useState } from 'react';

const SIDEBAR_ITEMS = [
    { icon: <Layers size={20} />, label: 'Home', path: '/home' },
    {
        icon: <Calendar size={20} />,
        label: 'Events',
        path: '/events',
    },
    { icon: <Users size={20} />, label: 'Users', path: '/users' },
    { icon: <Users size={20} />, label: 'Friends', path: '/friends' },
    { icon: <User size={20} />, label: 'Profile', path: '/profile' },
];

export function Dashboard({ children }: PropsWithChildren) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    interface SidebarContentProps {
        showLabels?: boolean;
    }

    const SidebarContent: FC<SidebarContentProps> = ({ showLabels = true }) => (
        <Flex direction="column" p="4" height="100%">
            <Flex justify={'between'}>
                <Link to="/">
                    <Flex align="center" gap="3" mb="4">
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
                    display={{ initial: 'block', md: 'none' }}
                    style={{ zIndex: '2' }}
                >
                    <IconButton
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        variant="soft"
                    >
                        <X size={20} />
                    </IconButton>
                </Box>
            </Flex>
            <Separator size="4" mb="4" />
            <Flex direction="column" gap="4">
                {SIDEBAR_ITEMS.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={({ isActive }) => ({
                            backgroundColor: isActive
                                ? 'var(--red-4)'
                                : 'transparent',
                            color: 'var(--gray-12)',
                            textDecoration: 'none',
                            borderRadius: 'var(--radius-6)',
                            padding: '8px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            ':hover': {
                                backgroundColor: 'var(--red-4)',
                            },
                        })}
                    >
                        {item.icon}
                        {showLabels && <Text>{item.label}</Text>}
                    </NavLink>
                ))}
            </Flex>
            <Separator size="4" mb="4" />
            <Form action="/logout" method="post">
                <Button
                    type="submit"
                    variant="soft"
                    color="gray"
                    style={{
                        width: '100%',
                        backgroundColor: 'var(--red-2',
                        borderRadius: 'var(--radius-6)',
                    }}
                >
                    <Flex align="center" gap="2">
                        <LogOut size={16} />
                        {showLabels && <Text>Logout</Text>}
                    </Flex>
                </Button>
            </Form>
        </Flex>
    );

    return (
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
                    style={{
                        backgroundColor: 'var(--gray-1)',
                        borderRight: '1px solid var(--gray-6)',
                    }}
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
                    style={{
                        backgroundColor: 'var(--gray-1)',
                        borderRight: '1px solid var(--gray-6)',
                    }}
                    display={{ initial: 'none', md: 'block', lg: 'none' }}
                >
                    <SidebarContent showLabels={false} />
                </Box>

                {/* Main Content */}
                <Box
                    width="100%"
                    pl={{ initial: '20px', md: '72px', lg: '240px' }}
                    pr={{ initial: '20px' }}
                    mt={{ initial: '64px', md: '0' }}
                >
                    {children}
                </Box>
            </Flex>

            {/* Mobile Menu Button */}
            <Box
                position="fixed"
                top="4"
                left="4"
                display={{ initial: 'block', md: 'none' }}
                style={{ zIndex: '2' }}
            >
                <IconButton
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    variant="soft"
                >
                    <Menu size={20} />
                </IconButton>
            </Box>

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
                display={{ initial: 'block', md: 'none' }}
            >
                <SidebarContent showLabels={true} />
            </Box>
        </Flex>
    );
}
