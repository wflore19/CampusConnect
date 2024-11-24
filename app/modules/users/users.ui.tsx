import {
    Dialog,
    Button,
    Flex,
    TextField,
    Text,
    Select,
    Separator,
    Box,
} from '@radix-ui/themes';
import { Form } from '@remix-run/react';
import { UserDetails } from './users.types';

export function EditProfileModal({
    userDetails,
}: {
    userDetails: Partial<UserDetails>;
}) {
    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <Box>
                    <Button size={'2'} variant="soft">
                        Edit Profile
                    </Button>
                </Box>
            </Dialog.Trigger>
            <Dialog.Content maxWidth="450px">
                <Form
                    method="post"
                    action={`/api/user-details/${userDetails.userId}/update`}
                    navigate={false}
                >
                    <Dialog.Title>Edit profile</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                        Make changes to your profile.
                    </Dialog.Description>

                    <Flex direction="column" gap="3">
                        <div>
                            <Text as="div" size="2" mb="1" weight="bold">
                                About me
                            </Text>
                            <TextField.Root
                                defaultValue={userDetails.aboutMe || ''}
                                placeholder="What do you want to share?"
                                name="aboutMe"
                            />
                        </div>
                        <Flex
                            direction={{ initial: 'row', md: 'column' }}
                            gap="9"
                        >
                            <div>
                                <Text as="div" size="2" mb="1" weight="bold">
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
                            </div>
                            <div>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Relationship Status
                                </Text>
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
                            </div>
                        </Flex>
                        <div>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Age
                            </Text>
                            <TextField.Root
                                defaultValue={userDetails.age || undefined}
                                placeholder="Your age"
                                type="number"
                                name="age"
                            />
                        </div>
                        <div>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Birthday
                            </Text>
                            <TextField.Root
                                defaultValue={userDetails.birthday || undefined}
                                placeholder="Your birthday"
                                name="birthday"
                            />
                        </div>
                        <div>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Hometown
                            </Text>
                            <TextField.Root
                                defaultValue={userDetails.hometown || undefined}
                                placeholder="Your hometown"
                                name="hometown"
                            />
                        </div>
                        <div>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Interests
                            </Text>
                            <TextField.Root
                                defaultValue={
                                    userDetails.interests || undefined
                                }
                                placeholder="Your interests"
                                name="interests"
                            />
                        </div>
                        <div>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Favorite Music
                            </Text>
                            <TextField.Root
                                defaultValue={
                                    userDetails.favoriteMusic || undefined
                                }
                                placeholder="Your favorite music"
                                name="favoriteMusic"
                            />
                        </div>
                        <div>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Favorite Movies
                            </Text>
                            <TextField.Root
                                defaultValue={
                                    userDetails.favoriteMovies || undefined
                                }
                                placeholder="Your favorite movies"
                                name="favoriteMovies"
                            />
                        </div>
                        <div>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Favorite Books
                            </Text>
                            <TextField.Root
                                defaultValue={
                                    userDetails.favoriteBooks || undefined
                                }
                                placeholder="Your favorite books"
                                name="favoriteBooks"
                            />
                        </div>
                        <div>
                            <Text as="div" size="2" mb="1" weight="bold">
                                School
                            </Text>
                            <TextField.Root
                                defaultValue={userDetails.school || undefined}
                                placeholder="Your school"
                                name="school"
                            />
                        </div>
                        <div>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Work
                            </Text>
                            <TextField.Root
                                defaultValue={userDetails.work || undefined}
                                placeholder="Your work"
                                name="work"
                            />
                        </div>
                    </Flex>

                    <Separator size="4" mt="4" />

                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray">
                                Cancel
                            </Button>
                        </Dialog.Close>
                        <Dialog.Close>
                            <Button type="submit">Save</Button>
                        </Dialog.Close>
                    </Flex>
                </Form>
            </Dialog.Content>
        </Dialog.Root>
    );
}
