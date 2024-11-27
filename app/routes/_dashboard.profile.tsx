import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, useLoaderData, useRouteLoaderData } from '@remix-run/react';
import { getFriendsList } from '~/modules/friends/friends.core';
import { getSession, user } from '~/utils/session.server';
import {
    Avatar,
    Box,
    Button,
    Card,
    Link,
    Flex,
    Heading,
    Text,
    Separator,
} from '@radix-ui/themes';
import { getUserDetails } from '~/modules/users/users.queries';
import { UserDetails } from '~/modules/users/users.types';
import { db } from 'db/src';
import { UserDetailsRelationshipStatus, UserDetailsSex } from 'db/src/dist/db';
import React from 'react';

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

export async function action({ request }: ActionFunctionArgs) {
    const session = await getSession(request);
    const id = user(session);

    try {
        const formData = await request.formData();
        const aboutMe = formData.get('aboutMe');
        const sex = formData.get('sex');
        const age = formData.get('age');
        const birthday = formData.get('birthday');
        const favoriteBooks = formData.get('favoriteBooks');
        const favoriteMovies = formData.get('favoriteMovies');
        const favoriteMusic = formData.get('favoriteMusic');
        const hometown = formData.get('hometown');
        const interests = formData.get('interests');
        const relationshipStatus = formData.get('relationshipStatus');
        const school = formData.get('school');
        const work = formData.get('work');

        const record = await db
            .selectFrom('userDetails')
            .where('userId', '=', id)
            .executeTakeFirst();

        if (!record) {
            await db
                .insertInto('userDetails')
                .values({
                    userId: id,
                    aboutMe: aboutMe ? String(aboutMe) : null,
                    sex: sex ? (String(sex) as UserDetailsSex) : null,
                    age: age ? Number(age) : null,
                    birthday: birthday ? String(birthday) : null,
                    favoriteBooks: favoriteBooks ? String(favoriteBooks) : null,
                    favoriteMovies: favoriteMovies
                        ? String(favoriteMovies)
                        : null,
                    favoriteMusic: favoriteMusic ? String(favoriteMusic) : null,
                    hometown: hometown ? String(hometown) : null,
                    interests: interests ? String(interests) : null,
                    relationshipStatus: relationshipStatus
                        ? (String(
                              relationshipStatus
                          ) as UserDetailsRelationshipStatus)
                        : null,
                    school: school ? String(school) : null,
                    work: work ? String(work) : null,
                })
                .executeTakeFirst();
        } else {
            await db
                .updateTable('userDetails')
                .set({
                    userId: id,
                    aboutMe: aboutMe ? String(aboutMe) : null,
                    sex: sex ? (String(sex) as UserDetailsSex) : null,
                    age: age ? Number(age) : null,
                    birthday: birthday ? String(birthday) : null,
                    favoriteBooks: favoriteBooks ? String(favoriteBooks) : null,
                    favoriteMovies: favoriteMovies
                        ? String(favoriteMovies)
                        : null,
                    favoriteMusic: favoriteMusic ? String(favoriteMusic) : null,
                    hometown: hometown ? String(hometown) : null,
                    interests: interests ? String(interests) : null,
                    relationshipStatus: relationshipStatus
                        ? (String(
                              relationshipStatus
                          ) as UserDetailsRelationshipStatus)
                        : null,
                    school: school ? String(school) : null,
                    work: work ? String(work) : null,
                })
                .where('userId', '=', id)
                .executeTakeFirst();
        }

        return {};
    } catch (error) {
        return { error: (error as Error).message };
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
        <React.Fragment>
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
                        <Heading as="h2" size="6" weight="bold" mb="1">
                            {firstName} {lastName}
                        </Heading>
                    </Box>

                    <Box>
                        <Link href="/friends">
                            Friends ({friendsList.length})
                        </Link>
                    </Box>

                    <Box>
                        <Link href="/profile/update">
                            <Button size={'2'} variant="soft">
                                Edit Profile
                            </Button>
                        </Link>
                    </Box>
                    {/* <EditProfileModal userDetails={userDetails} /> */}

                    <UserInformationDisplay
                        userDetails={userDetails}
                        email={email}
                    />
                </Flex>
            </Card>
            <Outlet />
        </React.Fragment>
    );
}

export function UserInformationDisplay({
    userDetails,
    email,
}: {
    userDetails: Partial<UserDetails>;
    email: string;
}) {
    return (
        <React.Fragment>
            {userDetails.aboutMe && (
                <Box>
                    <Text as="div" size="2" weight="bold" mb="1">
                        About Me
                    </Text>
                    <Text as="div" size="3">
                        {userDetails.aboutMe || ''}
                    </Text>
                </Box>
            )}

            {email && (
                <Box>
                    <Text as="div" size="2" weight="bold" mb="1">
                        Contact Info
                    </Text>
                    <Text as="div" size="3">
                        {email}
                    </Text>
                </Box>
            )}

            {userDetails.sex && (
                <Box>
                    <Text as="div" size="2" weight="bold" mb="1">
                        Sex
                    </Text>
                    <Text as="div" size="3">
                        {userDetails.sex || ''}
                    </Text>
                </Box>
            )}

            {userDetails.relationshipStatus && (
                <Box>
                    <Text as="div" size="2" weight="bold" mb="1">
                        Relationship Status
                    </Text>
                    <Text as="div" size="3">
                        {userDetails.relationshipStatus || ''}
                    </Text>
                </Box>
            )}

            {userDetails.age && (
                <Box>
                    <Text as="div" size="2" weight="bold" mb="1">
                        Age
                    </Text>
                    <Text as="div" size="3">
                        {userDetails.age || ''}
                    </Text>
                </Box>
            )}

            {userDetails.birthday && (
                <Box>
                    <Text as="div" size="2" weight="bold" mb="1">
                        Birthday
                    </Text>
                    <Text as="div" size="3">
                        {userDetails.birthday || ''}
                    </Text>
                </Box>
            )}

            {userDetails.hometown && (
                <Box>
                    <Text as="div" size="2" weight="bold" mb="1">
                        Hometown
                    </Text>
                    <Text as="div" size="3">
                        {userDetails.hometown || ''}
                    </Text>
                </Box>
            )}

            {userDetails.interests && userDetails.interests.length > 0 && (
                <Box>
                    <Text as="div" size="2" weight="bold" mb="1">
                        Interests
                    </Text>
                    <Text as="div" size="3">
                        {userDetails.interests || ''}
                    </Text>
                </Box>
            )}

            {userDetails.favoriteMusic &&
                userDetails.favoriteMusic.length > 0 && (
                    <Box>
                        <Text as="div" size="2" weight="bold" mb="1">
                            Favorite Music
                        </Text>
                        <Text as="div" size="3">
                            {userDetails.favoriteMusic || ''}
                        </Text>
                    </Box>
                )}

            {userDetails.favoriteMovies &&
                userDetails.favoriteMovies.length > 0 && (
                    <Box>
                        <Text as="div" size="2" weight="bold" mb="1">
                            Favorite Movies
                        </Text>
                        <Text as="div" size="3">
                            {userDetails.favoriteMovies || ''}
                        </Text>
                    </Box>
                )}

            {userDetails.favoriteBooks &&
                userDetails.favoriteBooks.length > 0 && (
                    <Box>
                        <Text as="div" size="2" weight="bold" mb="1">
                            Favorite Books
                        </Text>
                        <Text as="div" size="3">
                            {userDetails.favoriteBooks || ''}
                        </Text>
                    </Box>
                )}

            {userDetails.school && (
                <Box>
                    <Text as="div" size="2" weight="bold" mb="1">
                        School
                    </Text>
                    <Text as="div" size="3">
                        {userDetails.school || ''}
                    </Text>
                </Box>
            )}

            {userDetails.work && (
                <Box>
                    <Text as="div" size="2" weight="bold" mb="1">
                        Work
                    </Text>
                    <Text as="div" size="3">
                        {userDetails.work || ''}
                    </Text>
                </Box>
            )}
        </React.Fragment>
    );
}
