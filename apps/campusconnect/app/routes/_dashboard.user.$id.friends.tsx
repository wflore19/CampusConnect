import type { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Box, Heading, Card, Flex, Avatar, Text } from '@radix-ui/themes';
import { getUserById, type User, getFriendsIDs } from '@campusconnect/db';
import { Modal } from '~/components/modal';
import { RiUserLine } from '@remixicon/react';

export async function loader({ params }: LoaderFunctionArgs) {
    const { id: userId } = params;
    if (!userId) throw new Error('User ID not provided');

    try {
        const friendsList: User[] = [];
        const friendsIds = await getFriendsIDs(Number(userId));

        for (const id of friendsIds) {
            const friend = await getUserById(id);
            if (!friend) continue;

            friendsList.push(friend);
        }
        const userProfile = await getUserById(Number(userId));

        return { friendsList, userProfile, userId };
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export default function UserFriends() {
    const { friendsList, userProfile, userId } = useLoaderData<typeof loader>();

    return (
        <Modal onCloseTo={`/user/${userId}`} size="600">
            <Heading size="8" mb="6">
                {userProfile.firstName}&apos;s Friends
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
                                <Link to={`/user/${friend.id}`}>
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
