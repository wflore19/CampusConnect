import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from 'db/src';
import { Divider } from '~/components/divider';
import { Text } from '~/components/text';
import { ensureUserAuthenticated, user } from '~/utils/session.server';
import { getPendingFriendRequest } from '~/modules/friends/friends.core';
import { FriendshipStatusControl } from '~/modules/friends/friends.ui';

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { id: userId } = params;
    if (!userId) throw new Error('User ID not provided');
    const session = await ensureUserAuthenticated(request);
    const id = user(session);
    if (userId === id.toString()) redirect('/profile');

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
        <div className="px-2 py-6">
            <Text className="mb-4 text-3xl font-bold">
                {firstName} {lastName}&apos;s Profile
            </Text>

            <Divider />

            <div className="mt-3 space-y-4">
                <img
                    src={profilePicture}
                    alt={`${firstName} ${lastName}`}
                    className="mb-4 h-32 w-32 rounded-full object-cover"
                />
                <FriendshipStatusControl
                    friendRequest={friendRequest}
                    userId={userId}
                    id={id}
                />
                <div>
                    <Text className="font-semibold">Email</Text>
                    <Text>{email}</Text>
                </div>
            </div>
        </div>
    );
}
