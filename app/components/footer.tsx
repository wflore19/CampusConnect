import { Flex, Link, Text } from '@radix-ui/themes';

export function Footer() {
    return (
        <Flex direction="column" justify="between" align={'center'} pb="4">
            <Text>&copy; 2023 CampusConnect. All rights reserved.</Text>
            <Link href="/privacy-policy">Privacy Policy</Link>
        </Flex>
    );
}
