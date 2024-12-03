import type { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getUsersList } from '@campusconnect/db';
import { ensureUserAuthenticated, user } from '~/utils/session.server';
import { Avatar, Box, Card, Link, Flex, Heading, Text } from '@radix-ui/themes';
import { RiUserLine } from '@remixicon/react';

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await ensureUserAuthenticated(request);
    const id = user(session);

    try {
        const users = await getUsersList(id);
        return users;
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export default function Home() {
    const users = useLoaderData<typeof loader>();

    return (
        <>
            <Heading size="8" mb="6">
                Users
            </Heading>
            <Flex direction="column" gap="4">
                {users.map((user) => (
                    <Card key={user.id}>
                        <Flex align="center" gap="4">
                            <Avatar
                                radius="full"
                                size="5"
                                src={user.profilePicture!}
                                fallback={`${user.firstName![0]}${user.lastName![0]}`}
                            />
                            <Box>
                                <Link href={`/user/${user.id}`}>
                                    <Text size="3" weight="bold">
                                        <Flex align="center" gap="2">
                                            {`${user.firstName} ${user.lastName}`}{' '}
                                            <RiUserLine size={18} />
                                        </Flex>
                                    </Text>
                                </Link>
                            </Box>
                        </Flex>
                    </Card>
                ))}
            </Flex>
        </>
    );
}
