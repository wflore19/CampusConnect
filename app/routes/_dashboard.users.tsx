import type { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getUsersList } from '~/modules/users/users.core';
import { ensureUserAuthenticated, user } from '~/utils/session.server';
import {
    Avatar,
    Box,
    Button,
    Card,
    Dialog,
    Flex,
    Heading,
    Link,
} from '@radix-ui/themes';
import { getFriendsList } from '~/modules/friends/friends.core';

type User = {
    id: number | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    profilePicture: string | null;
    mutualFriends?: User[]; // Add this line
};

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await ensureUserAuthenticated(request);
    const id = user(session);

    try {
        // Task: Get the mutual friends of each user

        // Get the list of all users
        const rawUsers = await getUsersList(id); // o(n)

        // Add mutualFriends property to each user
        const users: User[] = rawUsers.map((friend) => {
            return {
                id: friend.id,
                firstName: friend.firstName,
                lastName: friend.lastName,
                email: friend.email,
                profilePicture: friend.profilePicture,
                mutualFriends: [],
            };
        }); // o(n)

        for (const user of users) {
            // o(n)
            // Get the friends list of  user
            const userFriends = await getFriendsList(user.id!); // o(n)

            // Get the mutual friends of the user
            const mutuals = rawUsers.filter((f) =>
                userFriends.some((uf) => uf.id === f.id)
            ); // o(n^2)

            // Fill the mutual friends property to the user
            mutuals.forEach((mutual) => {
                return user.mutualFriends!.push(mutual); // o(n)
            }); // o(n)
        }

        // Time Complexity: O(n^3)

        return { users };
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export default function Home() {
    const { users } = useLoaderData<typeof loader>() as { users: User[] };

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
                                fallback={`${user.firstName}${user.lastName}`}
                            />
                            <Flex direction={'column'} gap="1">
                                <Box>
                                    <Link
                                        href={`/user/${user.id}`}
                                        size="3"
                                        weight="bold"
                                    >
                                        {user.firstName} {user.lastName}
                                    </Link>
                                </Box>

                                {user.mutualFriends!.length > 0 && (
                                    <MutualFriendsModal
                                        mutualFriends={user.mutualFriends!}
                                    />
                                )}
                            </Flex>
                        </Flex>
                    </Card>
                ))}
            </Flex>
        </>
    );
}

function MutualFriendsModal({ mutualFriends }: { mutualFriends: User[] }) {
    return (
        <>
            <Dialog.Root>
                <Dialog.Trigger>
                    <Box>
                        <Button size={'1'} variant="soft">
                            Mutual Friends {mutualFriends.length}
                        </Button>
                    </Box>
                </Dialog.Trigger>
                <Dialog.Content maxWidth="450px">
                    <Heading size="6">Mutual Friends</Heading>
                    <Flex direction="column" gap="4" mt="4">
                        {(mutualFriends || []).map((friend) => (
                            <Card key={friend.id}>
                                <Flex align="center" gap="4">
                                    <Avatar
                                        radius="full"
                                        size="5"
                                        src={friend.profilePicture!}
                                        fallback={`${friend.firstName}${friend.lastName}`}
                                    />
                                    <Box>
                                        <Link
                                            href={`/user/${friend.id}`}
                                            size="3"
                                            weight="bold"
                                        >
                                            {friend.firstName} {friend.lastName}
                                        </Link>
                                    </Box>
                                </Flex>
                            </Card>
                        ))}
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
        </>
    );
}
