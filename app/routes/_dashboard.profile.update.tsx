import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    redirect,
} from '@remix-run/node';
import {
    Form,
    Link,
    isRouteErrorResponse,
    useLoaderData,
    useRouteError,
} from '@remix-run/react';
import { getSession, user } from '~/utils/session.server';
import { getUserDetails } from '~/modules/users/users.queries';
import { UserDetails } from '~/modules/users/users.types';
import { db } from 'db/src';
import { UserDetailsRelationshipStatus, UserDetailsSex } from 'db/src/dist/db';
import { Modal } from '~/components/modal';
import { Button, Flex, TextField, Text, Box, Select } from '@radix-ui/themes';
import { Edit3 } from 'react-feather';

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    const id = user(session);

    try {
        const userDetails = await getUserDetails(id);

        return {
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

        return redirect(`/profile`);
    } catch (error) {
        return { error: (error as Error).message };
    }
}

type LoaderData = {
    userDetails: Partial<UserDetails>;
};

export default function ProfileUpdate() {
    const { userDetails } = useLoaderData<typeof loader>() as LoaderData;

    return (
        <Modal onCloseTo={`/profile`} size="600">
            <Modal.Header>
                <Modal.Title>Edit Post</Modal.Title>
                <Modal.CloseButton />
            </Modal.Header>

            <Modal.Description>
                Make changes to your post here.
            </Modal.Description>

            <Form method="put">
                <Modal.Content>
                    <Flex direction="column" gap="3">
                        <Box>
                            <Text size="2" mb="1" weight="bold">
                                About me
                            </Text>
                            <TextField.Root
                                defaultValue={userDetails.aboutMe || ''}
                                placeholder="What do you want to share?"
                                name="aboutMe"
                            />
                        </Box>
                        <Flex
                            direction={{ initial: 'row', md: 'column' }}
                            gap={{ initial: '9', md: '4' }}
                        >
                            <Box>
                                <Text size="2" mb="1" weight="bold">
                                    Sex
                                </Text>
                                <Box width={'100%'}>
                                    <Select.Root
                                        defaultValue={
                                            userDetails.sex || undefined
                                        }
                                        name="sex"
                                    >
                                        <Select.Trigger placeholder="Select" />
                                        <Select.Content>
                                            <Select.Item value="male">
                                                Male
                                            </Select.Item>
                                            <Select.Item value="female">
                                                Female
                                            </Select.Item>
                                            <Select.Item value="other">
                                                Other
                                            </Select.Item>
                                        </Select.Content>
                                    </Select.Root>
                                </Box>
                            </Box>
                            <Box>
                                <Text size="2" mb="1" weight="bold">
                                    Relationship Status
                                </Text>
                                <Box width={'100%'}>
                                    <Select.Root
                                        defaultValue={
                                            userDetails.relationshipStatus ||
                                            undefined
                                        }
                                        name="relationshipStatus"
                                    >
                                        <Select.Trigger placeholder="Select" />
                                        <Select.Content>
                                            <Select.Item value="single">
                                                Single
                                            </Select.Item>
                                            <Select.Item value="taken">
                                                Taken
                                            </Select.Item>
                                            <Select.Item value="married">
                                                Married
                                            </Select.Item>
                                            <Select.Item value="complicated">
                                                Complicated
                                            </Select.Item>
                                        </Select.Content>
                                    </Select.Root>
                                </Box>
                            </Box>
                        </Flex>
                        <Box>
                            <Text size="2" mb="1" weight="bold">
                                Age
                            </Text>
                            <TextField.Root
                                defaultValue={userDetails.age || undefined}
                                placeholder="Your age"
                                type="number"
                                name="age"
                            />
                        </Box>
                        <Box>
                            <Text size="2" mb="1" weight="bold">
                                Birthday
                            </Text>
                            <TextField.Root
                                defaultValue={userDetails.birthday || undefined}
                                placeholder="Your birthday"
                                name="birthday"
                            />
                        </Box>
                        <Box>
                            <Text size="2" mb="1" weight="bold">
                                Hometown
                            </Text>
                            <TextField.Root
                                defaultValue={userDetails.hometown || undefined}
                                placeholder="Your hometown"
                                name="hometown"
                            />
                        </Box>
                        <Box>
                            <Text size="2" mb="1" weight="bold">
                                Interests
                            </Text>
                            <TextField.Root
                                defaultValue={
                                    userDetails.interests || undefined
                                }
                                placeholder="Your interests"
                                name="interests"
                            />
                        </Box>
                        <Box>
                            <Text size="2" mb="1" weight="bold">
                                Favorite Music
                            </Text>
                            <TextField.Root
                                defaultValue={
                                    userDetails.favoriteMusic || undefined
                                }
                                placeholder="Your favorite music"
                                name="favoriteMusic"
                            />
                        </Box>
                        <Box>
                            <Text size="2" mb="1" weight="bold">
                                Favorite Movies
                            </Text>
                            <TextField.Root
                                defaultValue={
                                    userDetails.favoriteMovies || undefined
                                }
                                placeholder="Your favorite movies"
                                name="favoriteMovies"
                            />
                        </Box>
                        <Box>
                            <Text size="2" mb="1" weight="bold">
                                Favorite Books
                            </Text>
                            <TextField.Root
                                defaultValue={
                                    userDetails.favoriteBooks || undefined
                                }
                                placeholder="Your favorite books"
                                name="favoriteBooks"
                            />
                        </Box>
                        <Box>
                            <Text size="2" mb="1" weight="bold">
                                School
                            </Text>
                            <TextField.Root
                                defaultValue={userDetails.school || undefined}
                                placeholder="Your school"
                                name="school"
                            />
                        </Box>
                        <Box>
                            <Text size="2" mb="1" weight="bold">
                                Work
                            </Text>
                            <TextField.Root
                                defaultValue={userDetails.work || undefined}
                                placeholder="Your work"
                                name="work"
                            />
                        </Box>
                    </Flex>
                </Modal.Content>

                <Modal.Actions>
                    <Link to={`/profile`}>
                        <Button
                            type="button"
                            color="gray"
                            variant="soft"
                            highContrast
                        >
                            Cancel
                        </Button>
                    </Link>

                    <Button type="submit" color="indigo" variant="soft">
                        <Edit3 className="mr-2" size={16} /> Update Profile
                    </Button>
                </Modal.Actions>
            </Form>
        </Modal>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <Box>
                <h1>
                    {error.status} {error.statusText}
                </h1>
                <p>{error.data}</p>
            </Box>
        );
    } else if (error instanceof Error) {
        return (
            <Box>
                <h1>Error</h1>
                <p>{error.message}</p>
                <p>The stack trace is:</p>
                <pre>{error.stack}</pre>
            </Box>
        );
    } else {
        return <h1>Unknown Error</h1>;
    }
}
