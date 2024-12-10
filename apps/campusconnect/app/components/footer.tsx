import { Flex, Text } from '@radix-ui/themes';
import { Link } from '@remix-run/react';

export function Footer() {
    return (
        <Flex direction="column" justify="between" align={'center'} pb="4">
            <Text>&copy; 2023 CampusConnect. All rights reserved.</Text>
            <Link to="/privacy-policy">Privacy Policy</Link>
        </Flex>
    );
}
