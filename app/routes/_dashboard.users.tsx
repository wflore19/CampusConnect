import type { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getUsersList } from '~/modules/users/users.core';
import { ensureUserAuthenticated, user } from '~/utils/session.server';
import { Avatar, Box, Card, Flex, Heading, Link } from '@radix-ui/themes';

type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
};

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
    const { users } = useLoaderData<typeof loader>() as { users: User[] };

    return (
        <>
            <Heading size="6" mb="4">
                Users
            </Heading>
            <Flex direction="column" gap="4">
                {users.map((user) => (
                    <Card key={user.id}>
                        <Flex align="center" gap="4">
                            <Avatar
                                size="5"
                                src={user.profilePicture}
                                fallback={`${user.firstName[0]}${user.lastName[0]}`}
                            />
                            <Box>
                                <Link
                                    href={`/user/${user.id}`}
                                    size="3"
                                    weight="bold"
                                >
                                    {user.firstName} {user.lastName}
                                </Link>
                            </Box>
                        </Flex>
                    </Card>
                ))}
            </Flex>
        </>
    );
}
