import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useRouteLoaderData } from '@remix-run/react';
import { getFriendsList } from '~/modules/friends/friends.core';
import { getSession, user } from '~/utils/session.server';
import { Avatar, Flex, Heading, Text } from '@radix-ui/themes';

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    const id = user(session);

    const friendsList = await getFriendsList(id);

    return friendsList.length > 0 ? friendsList : [];
}

export default function MyProfile() {
    const friendsList = useLoaderData<typeof loader>();
    const { firstName, lastName, profilePicture } = useRouteLoaderData(
        'routes/_dashboard'
    ) as {
        firstName: string;
        lastName: string;
        email: string;
        profilePicture: string;
    };

    return (
        <Flex direction={'column'}>
            <Heading as="h1" size={'9'}>
                {firstName} {lastName}
            </Heading>

            <Flex direction={'column'} gap={'3'}>
                <Flex gap="2">
                    <Avatar
                        src={profilePicture}
                        size={'8'}
                        radius="full"
                        fallback="A"
                    />
                </Flex>

                <Flex gap={'1'}>
                    <Text className="font-semibold">Friends</Text>
                    <Text>{friendsList.length}</Text>
                </Flex>
            </Flex>
        </Flex>
    );
}
