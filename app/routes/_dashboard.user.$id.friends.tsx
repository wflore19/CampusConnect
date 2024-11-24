import type { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getFriendsList } from '~/modules/friends/friends.core';
import { Box, Heading, Card, Flex, Avatar, Link } from '@radix-ui/themes';
import { getUserById } from '~/modules/users/users.core';
import { Friend } from '~/modules/friends/friends.types';
import { UserProfile } from '~/modules/users/users.types';

export async function loader({ params }: LoaderFunctionArgs) {
    const { id: userId } = params;
    if (!userId) throw new Error('User ID not provided');

    try {
        const friendsList = await getFriendsList(Number(userId));
        const userProfile = await getUserById(Number(userId));

        return friendsList.length > 0
            ? { friendsList, userProfile }
            : { friendsList: [], userProfile };
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export default function UserFriends() {
    const { friendsList, userProfile } = useLoaderData<typeof loader>() as {
        friendsList: Friend[];
        userProfile: UserProfile;
    };

    return (
        <>
            <Heading size="6" mb="4">
                {userProfile.firstName}&apos;s Friends
            </Heading>
            <Flex direction="column" gap="4">
                {friendsList.map((friend) => (
                    <Card key={friend.id}>
                        <Flex align="center" gap="4">
                            <Avatar
                                radius="full"
                                size="5"
                                src={friend.profilePicture}
                                fallback={`${friend.firstName[0]}${friend.lastName[0]}`}
                            />
                            <Box>
                                <Link
                                    href={`/user/${friend.id}`}
                                    size="3"
                                    weight="bold"
                                >{`${friend.firstName} ${friend.lastName}`}</Link>
                            </Box>
                        </Flex>
                    </Card>
                ))}
            </Flex>
        </>
    );
}
