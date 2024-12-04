import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { ensureUserAuthenticated, user } from '~/utils/session.server';
import { FriendshipStatusControl } from '~/modules/friends/friends.ui';
import { Avatar, Card, Flex, Heading, Separator, Box } from '@radix-ui/themes';
import {
    getUserById,
    getFriendshipStatus,
    getFriendsIDs,
    User,
} from '@campusconnect/db';
import React from 'react';
import { RiGroupLine } from '@remixicon/react';

export async function loader({ request, params }: LoaderFunctionArgs) {
    const id = params.id;
    const session = await ensureUserAuthenticated(request);
    const userId = user(session);
    if (userId === Number(id)) return redirect('/profile');

    try {
        const friendship =
            (await getFriendshipStatus(userId, Number(id))) || undefined;

        const friendsList: User[] = [];
        const friendsIds = await getFriendsIDs(Number(id));
        if (friendsIds.length > 0) {
            for (const item of friendsIds) {
                const friend = await getUserById(item.id);
                if (!friend) continue;

                friendsList.push(friend);
            }
        }

        const userProfile = await getUserById(Number(id));

        return {
            userId,
            userProfile,
            friendship,
            friendsList,
        };
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export default function UserProfile() {
    const { userId, userProfile, friendship, friendsList } =
        useLoaderData<typeof loader>();

    return (
        <React.Fragment>
            <Heading size="8" mb="6">
                {userProfile.firstName}&apos;s Profile
            </Heading>

            <Separator size="4" mb="4" />

            <Card>
                <Flex direction="column" gap="4">
                    <Avatar
                        radius="full"
                        size="8"
                        src={userProfile.profilePicture!}
                        fallback={`${userProfile.firstName}${userProfile.lastName}`}
                        mb="2"
                    />
                    <Box>
                        <Heading as="h2" size="6" weight="bold" mb="1">
                            {userProfile.firstName} {userProfile.lastName}
                        </Heading>
                    </Box>
                    <FriendshipStatusControl
                        friendship={friendship}
                        userId={Number(userId)}
                        id={userProfile.id}
                    />
                    <Box>
                        <Link to={`/user/${userProfile.id}/friends`}>
                            <Flex align="center" gap="2">
                                <RiGroupLine size={18} /> Friends (
                                {friendsList.length})
                            </Flex>
                        </Link>
                    </Box>
                </Flex>
            </Card>
            <Outlet />
        </React.Fragment>
    );
}
