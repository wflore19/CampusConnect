import { Flex, Heading, Link } from '@radix-ui/themes';

export function Header() {
    return (
        <Link href="/" color="gray">
            <Flex justify="start" align="center" p="4" gap="3">
                <img
                    src="/images/logo.png"
                    alt="Campus Connect logo"
                    style={{
                        objectFit: 'cover',
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-2)',
                    }}
                />
                <Heading as="h1" size="6">
                    CampusConnect
                </Heading>
            </Flex>
        </Link>
    );
}
