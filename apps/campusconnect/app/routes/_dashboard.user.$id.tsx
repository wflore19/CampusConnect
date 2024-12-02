import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { ensureUserAuthenticated, user } from '~/utils/session.server';
import { FriendshipStatusControl } from '~/modules/friends/friends.ui';
import { Avatar, Card, Flex, Heading, Separator, Box } from '@radix-ui/themes';
import {
    getUserById,
    getFriendsList,
    getPendingFriendRequest,
} from '@campusconnect/db';
import React from 'react';
import { RiGroupLine } from '@remixicon/react';

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { id: userId } = params;
    if (!userId) throw new Error('User ID not provided');
    const session = await ensureUserAuthenticated(request);
    const id = user(session);
    if (userId === id.toString()) return redirect('/profile');

    try {
        const userProfile = await getUserById(parseInt(userId));

        const friendRequest = await getPendingFriendRequest(
            parseInt(userId),
            id
        );

        const friendsList = await getFriendsList(parseInt(userId));

        return {
            ...userProfile,
            friendRequest,
            id: parseInt(userId),
            friendsList,
        };
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export default function UserProfile() {
    const {
        id: userId,
        firstName,
        lastName,
        profilePicture,
        friendRequest,
        id,
        friendsList,
    } = useLoaderData<typeof loader>() as {
        userId: number;
        firstName: string;
        lastName: string;
        email: string;
        profilePicture: string;
        friendRequest:
            | {
                  uid1: number;
                  uid2: number;
                  status: string;
              }
            | undefined;
        id: number;
        friendsList: {
            id: number;
            firstName: string;
            lastName: string;
            email: string;
            profilePicture: string;
        }[];
    };

    return (
        <React.Fragment>
            <Heading size="8" mb="6">
                {firstName}&apos;s Profile
            </Heading>

            <Separator size="4" mb="4" />

            <Card>
                <Flex direction="column" gap="4">
                    <Avatar
                        radius="full"
                        size="8"
                        src={profilePicture}
                        fallback={`${firstName}${lastName}`}
                        mb="2"
                    />
                    <Box>
                        <Heading as="h2" size="6" weight="bold" mb="1">
                            {firstName} {lastName}
                        </Heading>
                    </Box>
                    <FriendshipStatusControl
                        friendRequest={friendRequest}
                        userId={userId}
                        id={id}
                    />
                    <Box>
                        <Link to={`/user/${userId}/friends`}>
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
