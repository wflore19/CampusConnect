import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { ensureUserAuthenticated, user } from '~/utils/session.server';
import {
    getFriendsList,
    getPendingFriendRequest,
} from '~/modules/friends/friends.core';
import { FriendshipStatusControl } from '~/modules/friends/friends.ui';
import {
    Avatar,
    Card,
    Heading,
    Separator,
    Box,
    Button,
    Flex,
    Spinner,
} from '@radix-ui/themes';
import { getUserById } from '~/modules/users/users.core';
import React from 'react';
import { RiGroupLine } from '@remixicon/react';
import { useSocket } from '~/utils/socket';

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { id } = params;
    if (!id) throw new Error('User ID not provided');
    const session = await ensureUserAuthenticated(request);
    const userId = user(session);
    if (userId.toString() === id) return redirect('/profile');

    try {
        const userProfile = await getUserById(parseInt(id));

        const friendRequest = await getPendingFriendRequest(
            parseInt(id),
            userId
        );

        const friendsList = await getFriendsList(parseInt(id));

        return {
            userProfile,
            friendRequest,
            userId,
            friendsList,
        };
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export default function UserProfile() {
    const { userProfile, friendRequest, userId, friendsList } = useLoaderData<
        typeof loader
    >() as {
        userProfile: any;
        friendRequest: any;
        userId: number;
        friendsList: any[];
    };
    const { socket } = useSocket();

    if (!socket) {
        return (
            <Flex justify={'center'} align={'center'}>
                <Spinner />
            </Flex>
        );
    }

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
                        src={userProfile.profilePicture}
                        fallback={`${userProfile.firstName}${userProfile.lastName}`}
                        mb="2"
                    />
                    <Box>
                        <Heading as="h2" size="6" weight="bold" mb="1">
                            {userProfile.firstName} {userProfile.lastName}
                        </Heading>
                    </Box>
                    {/* <FriendshipStatusControl
                        friendRequest={friendRequest}
                        userId={userId}
                        id={userProfile.id}
                        socket={socket}
                    /> */}
                    <Button
                        color="indigo"
                        variant="surface"
                        onClick={() => {
                            if (socket) {
                                socket.emit('friend-request', {
                                    fromUID: userId,
                                    toUID: userProfile.id,
                                    type: 'friend-request',
                                    message: 'Friend Request',
                                });
                            }
                        }}
                    >
                        Send FR
                    </Button>
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
