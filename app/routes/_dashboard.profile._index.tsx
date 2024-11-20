import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useRouteLoaderData } from '@remix-run/react';
import { Divider } from '~/components/divider';
import { Text } from '~/components/text';
import { getFriendsList } from '~/modules/friends/friends.core';
import { getSession, user } from '~/utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    const id = user(session);

    const friendsList = await getFriendsList(id);

    return friendsList.length > 0 ? friendsList : [];
}

export default function MyProfile() {
    const friendsList = useLoaderData<typeof loader>();
    const { firstName, lastName, email, profilePicture } = useRouteLoaderData(
        'routes/_dashboard'
    ) as {
        firstName: string;
        lastName: string;
        email: string;
        profilePicture: string;
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
                    alt={firstName + ' ' + lastName}
                    className="mb-4 h-32 w-32 rounded-full object-cover"
                />

                <div>
                    <Text className="font-semibold">Email</Text>
                    <Text>{email}</Text>
                </div>
                {/* Friends Count */}
                <div>
                    <Text className="font-semibold">Friends</Text>
                    <Text>{friendsList.length}</Text>
                </div>
            </div>
        </div>
    );
}
