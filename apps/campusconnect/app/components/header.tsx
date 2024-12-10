import { Flex, Heading, Box } from '@radix-ui/themes';
import { Link } from '@remix-run/react';

export function Header() {
    return (
        <Box py="3" px="6">
            <Flex align="center" justify="between">
                <Link to="/">
                    <Flex align="center" gap="3">
                        <img
                            src="/images/logo.png"
                            alt="Campus Connect logo"
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: 'var(--radius-2)',
                            }}
                        />
                        <Heading as="h1" size="5" style={{ margin: 0 }}>
                            CampusConnect
                        </Heading>
                    </Flex>
                </Link>
                <Box />
            </Flex>
        </Box>
    );
}
