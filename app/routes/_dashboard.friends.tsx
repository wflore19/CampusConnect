import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getFriendsList } from '~/modules/friends/friends.core';
import { getSession, user } from '~/utils/session.server';
import { Box, Heading, Card, Flex, Avatar, Link } from '@radix-ui/themes';

export const meta: MetaFunction = () => {
    return [
        { title: 'CampusConnect - Your Friends' },
        {
            name: 'description',
            content: 'Connect with your friends on CampusConnect',
        },
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    const id = user(session);
    return getFriendsList(id);
}

export default function Friends() {
    const friendsList = useLoaderData<typeof loader>() as {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        profilePicture: string;
    }[];

    return (
        <>
            <Heading size="6" mb="4">
                Your Friends
            </Heading>
            <Flex direction="column" gap="4">
                {friendsList.map((friend) => (
                    <Card key={friend.id}>
                        <Flex align="center" gap="4">
                            <Avatar
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
