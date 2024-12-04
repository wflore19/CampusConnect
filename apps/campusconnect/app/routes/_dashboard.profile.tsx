import { LoaderFunctionArgs } from '@remix-run/node';
import {
    Outlet,
    useLoaderData,
    useRouteLoaderData,
    Link,
} from '@remix-run/react';
import {
    type User,
    getFriendsIDs,
    getUserById,
    getUserDetails,
    type UserDetails,
} from '@campusconnect/db';
import { getSession, user } from '~/utils/session.server';
import {
    Avatar,
    Box,
    Card,
    Flex,
    Heading,
    Separator,
    Button,
} from '@radix-ui/themes';
import { UserProfileInformation } from '~/modules/users/users.ui';
import { RiEdit2Line, RiGroupLine } from '@remixicon/react';

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    const userId = user(session);
    try {
        const friendsList: User[] = [];
        const friendsIds = await getFriendsIDs(userId);

        for (const id of friendsIds) {
            const friend = await getUserById(id);
            if (!friend) continue;

            friendsList.push(friend);
        }

        const userDetails: UserDetails = await getUserDetails(userId);

        return {
            friendsList,
            userDetails,
        };
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export default function MyProfile() {
    const { friendsList, userDetails } = useLoaderData<typeof loader>();
    const { firstName, lastName, email, profilePicture } = useRouteLoaderData(
        'routes/_dashboard'
    ) as User;

    return (
        <>
            <Heading size="8" mb="6">
                My Profile
            </Heading>

            <Separator size="4" mb="4" />

            <Card>
                <Flex direction="column" gap="4">
                    <Avatar
                        radius="full"
                        size="8"
                        src={profilePicture!}
                        fallback={`${firstName}${lastName}`}
                        mb="2"
                    />

                    <Box>
                        <Link to="/profile/update">
                            <Button size={'2'} variant="soft" color="indigo">
                                <RiEdit2Line size={20} /> Edit Profile
                            </Button>
                        </Link>
                    </Box>

                    <Box>
                        <Heading as="h2" size="6" weight="bold" mb="1">
                            {firstName} {lastName}
                        </Heading>
                    </Box>

                    <Box>
                        <Link to={`/profile/friends`}>
                            <Flex align="center" gap="2">
                                <RiGroupLine size={18} /> Friends (
                                {friendsList.length})
                            </Flex>
                        </Link>
                    </Box>

                    <UserProfileInformation
                        userDetails={userDetails}
                        email={email!}
                    />
                </Flex>
            </Card>
            <Outlet />
        </>
    );
}
