import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useRouteLoaderData } from '@remix-run/react';
import { getFriendsList } from '~/modules/friends/friends.core';
import { getSession, user } from '~/utils/session.server';
import {
    Avatar,
    Box,
    Card,
    Link,
    Flex,
    Heading,
    Text,
    Separator,
} from '@radix-ui/themes';

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    const id = user(session);

    const friendsList = await getFriendsList(id);

    return { friendsList: friendsList.length > 0 ? friendsList : [] };
}

export default function MyProfile() {
    const { friendsList } = useLoaderData<typeof loader>();
    const { firstName, lastName, email, profilePicture } = useRouteLoaderData(
        'routes/_dashboard'
    ) as {
        firstName: string;
        lastName: string;
        email: string;
        profilePicture: string;
    };

    return (
        <>
            <Heading size="7" mb="4">
                My Profile
            </Heading>

            <Separator size="4" mb="4" />

            <Card>
                <Flex direction="column" gap="4">
                    <Avatar
                        radius="full"
                        size="8"
                        src={profilePicture}
                        fallback={`${firstName[0]}${lastName[0]}`}
                        mb="2"
                    />
                    <Box>
                        <Text as="div" size="2" weight="bold" mb="1">
                            Name
                        </Text>
                        <Text as="div" size="3">
                            {firstName} {lastName}
                        </Text>
                    </Box>
                    <Box>
                        <Text as="div" size="2" weight="bold" mb="1">
                            Email
                        </Text>
                        <Text as="div" size="3">
                            {email}
                        </Text>
                    </Box>
                    <Box>
                        <Link href="/friends">
                            <Text as="div" size="2" weight="bold" mb="1">
                                Friends
                            </Text>
                            <Text as="div" size="3">
                                {friendsList.length}
                            </Text>
                        </Link>
                    </Box>
                </Flex>
            </Card>
        </>
    );
}
