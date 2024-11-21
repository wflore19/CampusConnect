import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from 'db/src';
import { ensureUserAuthenticated, user } from '~/utils/session.server';
import {
    getFriendsList,
    getPendingFriendRequest,
} from '~/modules/friends/friends.core';
import { FriendshipStatusControl } from '~/modules/friends/friends.ui';
import {
    Avatar,
    Card,
    Flex,
    Heading,
    Separator,
    Text,
    Box,
} from '@radix-ui/themes';

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { id: userId } = params;
    if (!userId) throw new Error('User ID not provided');
    const session = await ensureUserAuthenticated(request);
    const id = user(session);
    if (userId === id.toString()) return redirect('/profile');

    try {
        const userProfile = await db
            .selectFrom('users')
            .select(['id', 'email', 'firstName', 'lastName', 'profilePicture'])
            .where('id', '=', parseInt(userId))
            .executeTakeFirst();

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
        <>
            <Heading size="7" mb="4">
                {firstName} {lastName}
            </Heading>

            <Separator size="4" mb="4" />

            <Card>
                <Flex direction="column" gap="4">
                    <Avatar
                        size="8"
                        src={profilePicture}
                        fallback={`${firstName}${lastName}`}
                        mb="2"
                    />
                    <FriendshipStatusControl
                        friendRequest={friendRequest}
                        userId={userId}
                        id={id}
                    />
                    <Box>
                        <Text>Friends</Text>
                        {/* Number of friends // length of friendsList */}
                        <Text as="div" size="3" color="gray">
                            {friendsList.length}
                        </Text>
                    </Box>
                </Flex>
            </Card>
        </>
    );
}
