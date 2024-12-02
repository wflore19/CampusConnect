import { LoaderFunctionArgs } from '@remix-run/node';
import {
    Outlet,
    useLoaderData,
    useRouteLoaderData,
    Link,
} from '@remix-run/react';
import {
    getFriendsList,
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
    const id = user(session);
    try {
        const friendsList = await getFriendsList(id);
        const userDetails = await getUserDetails(id);

        return {
            friendsList: friendsList.length > 0 ? friendsList : [],
            userDetails: userDetails ? userDetails : {},
        };
    } catch (error) {
        console.error(error);
    }
}

type LoaderData = {
    friendsList: Array<{
        id: number | null;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
        profilePicture: string | null;
    }>;
    userDetails: Partial<UserDetails>;
};

export default function MyProfile() {
    const { friendsList, userDetails } = useLoaderData<
        typeof loader
    >() as LoaderData;
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
            <Heading size="8" mb="6">
                My Profile
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
                        email={email}
                    />
                </Flex>
            </Card>
            <Outlet />
        </>
    );
}
