import type { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { User, getFriendsIDs, getUserById } from '@campusconnect/db';
import { getSession, user } from '~/utils/session.server';
import { Link, Box, Heading, Card, Flex, Avatar, Text } from '@radix-ui/themes';
import { RiUserLine } from '@remixicon/react';
import { Modal } from '~/components/modal';

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    const userId = user(session);

    try {
        const friendsList: User[] = [];
        const friendsIds = await getFriendsIDs(userId);

        for (const item of friendsIds) {
            const friend = await getUserById(item.id);
            if (!friend) continue;

            friendsList.push(friend);
        }

        return { friendsList, userId };
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export default function Friends() {
    const { friendsList } = useLoaderData<typeof loader>();

    return (
        <Modal onCloseTo={`/profile`} size="600">
            <Heading size="8" mb="6">
                My Friends
            </Heading>
            <Flex direction="column" gap="4">
                {friendsList.map((friend) => (
                    <Card key={friend.id}>
                        <Flex align="center" gap="4">
                            <Avatar
                                radius="full"
                                size="5"
                                src={friend.profilePicture!}
                                fallback={`${friend.firstName![0]}${friend.lastName![0]}`}
                            />
                            <Box>
                                <Link href={`/user/${friend.id}`}>
                                    <Text size="3" weight="bold">
                                        <Flex align="center" gap="2">
                                            {`${friend.firstName} ${friend.lastName}`}{' '}
                                            <RiUserLine size={18} />
                                        </Flex>
                                    </Text>
                                </Link>
                            </Box>
                        </Flex>
                    </Card>
                ))}
            </Flex>
        </Modal>
    );
}
