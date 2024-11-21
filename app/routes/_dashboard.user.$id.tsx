import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from 'db/src';
import { ensureUserAuthenticated, user } from '~/utils/session.server';
import { getPendingFriendRequest } from '~/modules/friends/friends.core';
import { FriendshipStatusControl } from '~/modules/friends/friends.ui';
import {
    Avatar,
    Box,
    Card,
    Flex,
    Heading,
    Text,
    Separator,
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

        return { ...userProfile, friendRequest, id: parseInt(userId) };
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export default function UserProfile() {
    const {
        id: userId,
        firstName,
        lastName,
        email,
        profilePicture,
        friendRequest,
        id,
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
                        fallback={`${firstName[0]}${lastName[0]}`}
                        mb="2"
                    />
                    <FriendshipStatusControl
                        friendRequest={friendRequest}
                        userId={userId}
                        id={id}
                    />
                    <Box>
                        <Text as="div" size="2" weight="bold" mb="1">
                            Email
                        </Text>
                        <Text as="div" size="3">
                            {email}
                        </Text>
                    </Box>
                </Flex>
            </Card>
        </>
    );
}
