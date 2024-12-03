import React from 'react';
import { UserDetails } from '@campusconnect/db';
import { Flex, Text } from '@radix-ui/themes';

export function UserProfileInformation({
    userDetails,
    email,
}: {
    userDetails: Partial<UserDetails>;
    email: string;
}) {
    return (
        <React.Fragment>
            {userDetails.aboutMe && (
                <Flex direction={'column'}>
                    <Text size="2" weight="bold" mb="1">
                        About Me
                    </Text>
                    <Text size="3">{userDetails.aboutMe || ''}</Text>
                </Flex>
            )}

            {email && (
                <Flex direction={'column'}>
                    <Text size="2" weight="bold" mb="1">
                        Contact Info
                    </Text>
                    <Text size="3">{email}</Text>
                </Flex>
            )}

            {userDetails.sex && (
                <Flex direction={'column'}>
                    <Text size="2" weight="bold" mb="1">
                        Sex
                    </Text>
                    <Text size="3">{userDetails.sex || ''}</Text>
                </Flex>
            )}

            {userDetails.relationshipStatus && (
                <Flex direction={'column'}>
                    <Text size="2" weight="bold" mb="1">
                        Relationship Status
                    </Text>
                    <Text size="3">{userDetails.relationshipStatus || ''}</Text>
                </Flex>
            )}

            {userDetails.age && (
                <Flex direction={'column'}>
                    <Text size="2" weight="bold" mb="1">
                        Age
                    </Text>
                    <Text size="3">{userDetails.age || ''}</Text>
                </Flex>
            )}

            {userDetails.birthday && (
                <Flex direction={'column'}>
                    <Text size="2" weight="bold" mb="1">
                        Birthday
                    </Text>
                    <Text size="3">{userDetails.birthday || ''}</Text>
                </Flex>
            )}

            {userDetails.hometown && (
                <Flex direction={'column'}>
                    <Text size="2" weight="bold" mb="1">
                        Hometown
                    </Text>
                    <Text size="3">{userDetails.hometown || ''}</Text>
                </Flex>
            )}

            {userDetails.interests && userDetails.interests.length > 0 && (
                <Flex direction={'column'}>
                    <Text size="2" weight="bold" mb="1">
                        Interests
                    </Text>
                    <Text size="3">{userDetails.interests || ''}</Text>
                </Flex>
            )}

            {userDetails.favoriteMusic &&
                userDetails.favoriteMusic.length > 0 && (
                    <Flex direction={'column'}>
                        <Text size="2" weight="bold" mb="1">
                            Favorite Music
                        </Text>
                        <Text size="3">{userDetails.favoriteMusic || ''}</Text>
                    </Flex>
                )}

            {userDetails.favoriteMovies &&
                userDetails.favoriteMovies.length > 0 && (
                    <Flex direction={'column'}>
                        <Text size="2" weight="bold" mb="1">
                            Favorite Movies
                        </Text>
                        <Text size="3">{userDetails.favoriteMovies || ''}</Text>
                    </Flex>
                )}

            {userDetails.favoriteBooks &&
                userDetails.favoriteBooks.length > 0 && (
                    <Flex direction={'column'}>
                        <Text size="2" weight="bold" mb="1">
                            Favorite Books
                        </Text>
                        <Text size="3">{userDetails.favoriteBooks || ''}</Text>
                    </Flex>
                )}

            {userDetails.school && (
                <Flex direction={'column'}>
                    <Text size="2" weight="bold" mb="1">
                        School
                    </Text>
                    <Text size="3">{userDetails.school || ''}</Text>
                </Flex>
            )}

            {userDetails.work && (
                <Flex direction={'column'}>
                    <Text size="2" weight="bold" mb="1">
                        Work
                    </Text>
                    <Text size="3">{userDetails.work || ''}</Text>
                </Flex>
            )}
        </React.Fragment>
    );
}
