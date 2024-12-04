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
import {
    type UserDetails,
    updateUserDetails,
    getUserDetails,
} from '@campusconnect/db';
import { Modal } from '~/components/modal';
import { Button, Flex, TextField, Text, Box, Select } from '@radix-ui/themes';
import { RiEdit2Line } from '@remixicon/react';
import { RelationshipStatus, SexEnum } from '@campusconnect/db/schema';

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    const id = user(session);

    try {
        const userDetails: UserDetails = await getUserDetails(id);

        return userDetails;
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export default function ProfileUpdate() {
    const {
        aboutMe,
        age,
        sex,
        birthday,
        favoriteBooks,
        favoriteMovies,
        favoriteMusic,
        hometown,
        interests,
        relationshipStatus,
        school,
        work,
    } = useLoaderData<typeof loader>();

    return (
        <Modal onCloseTo={`/profile`} size="600">
            <Modal.Header>
                <Modal.Title>Edit Profile</Modal.Title>
                <Modal.CloseButton />
            </Modal.Header>

            <Modal.Description>Make changes to your profile.</Modal.Description>

            <Form method="put">
                <Modal.Content>
                    <Flex direction="column" gap="3">
                        <Box>
                            <Text size="2" mb="1" weight="bold">
                                About me
                            </Text>
                            <TextField.Root
                                defaultValue={aboutMe || ''}
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
                                        defaultValue={sex || undefined}
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
                                            relationshipStatus || undefined
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
                                defaultValue={age || undefined}
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
                                defaultValue={birthday || undefined}
                                placeholder="Your birthday"
                                name="birthday"
                            />
                        </Box>
                        <Box>
                            <Text size="2" mb="1" weight="bold">
                                Hometown
                            </Text>
                            <TextField.Root
                                defaultValue={hometown || undefined}
                                placeholder="Your hometown"
                                name="hometown"
                            />
                        </Box>
                        <Box>
                            <Text size="2" mb="1" weight="bold">
                                Interests
                            </Text>
                            <TextField.Root
                                defaultValue={interests || undefined}
                                placeholder="Your interests"
                                name="interests"
                            />
                        </Box>
                        <Box>
                            <Text size="2" mb="1" weight="bold">
                                Favorite Music
                            </Text>
                            <TextField.Root
                                defaultValue={favoriteMusic || undefined}
                                placeholder="Your favorite music"
                                name="favoriteMusic"
                            />
                        </Box>
                        <Box>
                            <Text size="2" mb="1" weight="bold">
                                Favorite Movies
                            </Text>
                            <TextField.Root
                                defaultValue={favoriteMovies || undefined}
                                placeholder="Your favorite movies"
                                name="favoriteMovies"
                            />
                        </Box>
                        <Box>
                            <Text size="2" mb="1" weight="bold">
                                Favorite Books
                            </Text>
                            <TextField.Root
                                defaultValue={favoriteBooks || undefined}
                                placeholder="Your favorite books"
                                name="favoriteBooks"
                            />
                        </Box>
                        <Box>
                            <Text size="2" mb="1" weight="bold">
                                School
                            </Text>
                            <TextField.Root
                                defaultValue={school || undefined}
                                placeholder="Your school"
                                name="school"
                            />
                        </Box>
                        <Box>
                            <Text size="2" mb="1" weight="bold">
                                Work
                            </Text>
                            <TextField.Root
                                defaultValue={work || undefined}
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
                        <RiEdit2Line size={16} /> Update Profile
                    </Button>
                </Modal.Actions>
            </Form>
        </Modal>
    );
}

export async function action({ request }: ActionFunctionArgs) {
    const session = await getSession(request);
    const userId = user(session);

    try {
        const formData = await request.formData();
        const aboutMe = formData.get('aboutMe')?.toString() ?? null;
        const sex = formData.get('sex')?.toString() ?? null;
        const validatedSex =
            sex === SexEnum.MALE ||
            sex === SexEnum.FEMALE ||
            sex === SexEnum.OTHER
                ? (sex as SexEnum)
                : null;

        const age = formData.get('age')?.toString()
            ? parseInt(formData.get('age')?.toString() ?? '', 10)
            : null;
        const birthday = formData.get('birthday')?.toString() ?? null;
        const favoriteBooks = formData.get('favoriteBooks')?.toString() ?? null;
        const favoriteMovies =
            formData.get('favoriteMovies')?.toString() ?? null;
        const favoriteMusic = formData.get('favoriteMusic')?.toString() ?? null;
        const hometown = formData.get('hometown')?.toString() ?? null;
        const interests = formData.get('interests')?.toString() ?? null;
        const relationshipStatus = formData
            .get('relationshipStatus')
            ?.toString();
        const validatedRelationshipStatus =
            relationshipStatus === RelationshipStatus.SINGLE ||
            relationshipStatus === RelationshipStatus.TAKEN ||
            relationshipStatus === RelationshipStatus.MARRIED ||
            relationshipStatus === RelationshipStatus.COMPLICATED
                ? (relationshipStatus as RelationshipStatus)
                : null;

        const school = formData.get('school')?.toString() ?? null;
        const work = formData.get('work')?.toString() ?? null;

        await updateUserDetails(userId, {
            userId: userId,
            aboutMe: aboutMe,
            sex: validatedSex,
            age: age,
            birthday: birthday,
            favoriteBooks: favoriteBooks,
            favoriteMovies: favoriteMovies,
            favoriteMusic: favoriteMusic,
            hometown: hometown,
            interests: interests,
            relationshipStatus: validatedRelationshipStatus,
            school: school,
            work: work,
        });
        return redirect(`/profile`);
    } catch (error) {
        return { error: (error as Error).message };
    }
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
