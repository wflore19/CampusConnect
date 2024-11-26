import {
    Avatar,
    Box,
    Flex,
    Heading,
    Text,
    Separator,
    TextArea,
    Button,
    Link,
    DropdownMenu,
} from '@radix-ui/themes';
import { ActionFunctionArgs, LoaderFunction } from '@remix-run/node';
import {
    NavLink,
    Outlet,
    useFetcher,
    useLoaderData,
} from '@remix-run/react';
import React from 'react';
import { Edit3, MoreVertical, Trash2 } from 'react-feather';
import { getFriendsList } from '~/modules/friends/friends.core';
import { createPost, getPostsById } from '~/modules/posts/posts.core';
import { Post, Posts } from '~/modules/posts/posts.types';
import { getSession, user } from '~/utils/session.server';

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request);
    const id = user(session);

    const friends = await getFriendsList(id);
    const feedPosts: Post[] = [];
    for (const friend of friends) {
        const post = await getPostsById(friend.id!);
        post.forEach((post) => {
            post.content = post.content.replace(/(?:\r\n|\r|\n)/g, '<br>');
            feedPosts.push(post);
        });
    }

    const myPosts = await getPostsById(id);
    myPosts.forEach((post) => {
        post.content = post.content.replace(/(?:\r\n|\r|\n)/g, '<br>');
        feedPosts.push(post);
    });

    feedPosts.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    });

    return {
        userId: id,
        feedPosts,
    };
};

export async function action({ request }: ActionFunctionArgs) {
    const session = await getSession(request);
    const id = user(session);

    const formData = await request.formData();
    const content = String(formData.get('content'));

    try {
        await createPost(id, content);
        return {};
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export default function Feed() {
    const { feedPosts, userId } = useLoaderData<typeof loader>() as {
        userId: number;
        feedPosts: Posts;
    };
    const fetcher = useFetcher();
    const [textAreaValue, setTextAreaValue] = React.useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetcher.submit(event.currentTarget, { method: 'post' });
        setTextAreaValue('');
    };

    return (
        <>
            <Box p="4">
                <Heading size="6" mb="4">
                    Feed
                </Heading>

                <Box>
                    <Box mb={'5'}>
                        <fetcher.Form
                            action={`/feed`}
                            method="post"
                            onSubmit={handleSubmit}
                        >
                            <Flex direction="column" gap="1">
                                <TextArea
                                    name="content"
                                    size={'3'}
                                    placeholder="What's on your mind?"
                                    value={textAreaValue}
                                    onChange={(event) => {
                                        setTextAreaValue(event.target.value);
                                    }}
                                />
                                <Box>
                                    <Button
                                        type="submit"
                                        size={{ initial: '3', md: '2' }}
                                        disabled={!textAreaValue}
                                    >
                                        {' '}
                                        <Edit3 /> Post{' '}
                                    </Button>
                                </Box>
                            </Flex>
                        </fetcher.Form>
                    </Box>
                    {feedPosts.map((post, index) => (
                        <Box key={post.id || index}>
                            <Box width={'full'}>
                                <Flex justify={'between'}>
                                    <Box>
                                        <Flex gap="3" align="center" mb="2">
                                            <Avatar
                                                size="3"
                                                src={
                                                    post.profilePicture || undefined
                                                }
                                                radius="full"
                                                fallback={
                                                    post.firstName + post.lastName
                                                }
                                            />
                                            <Flex
                                                direction="column"
                                                gap={{ initial: '0', md: '1' }}
                                            >
                                                <Link
                                                    href={`/user/${post.userId}`}
                                                    size={{ initial: '4', md: '2' }}
                                                    weight="medium"
                                                >
                                                    {post.firstName} {post.lastName}
                                                </Link>
                                                <Text
                                                    size={{ initial: '1', md: '2' }}
                                                >
                                                    {(() => {
                                                        const now = new Date();
                                                        const postDate = new Date(
                                                            post.createdAt
                                                        );
                                                        const diffInSeconds =
                                                            Math.floor(
                                                                (now.getTime() -
                                                                    postDate.getTime()) /
                                                                    1000
                                                            );

                                                        if (diffInSeconds < 60) {
                                                            return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
                                                        } else if (
                                                            diffInSeconds < 3600
                                                        ) {
                                                            // less than 1 hour
                                                            const minutes =
                                                                Math.floor(
                                                                    diffInSeconds /
                                                                        60
                                                                );
                                                            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
                                                        } else if (
                                                            diffInSeconds < 86400
                                                        ) {
                                                            // less than 24 hours
                                                            const hours =
                                                                Math.floor(
                                                                    diffInSeconds /
                                                                        3600
                                                                );
                                                            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
                                                        } else {
                                                            const days = Math.floor(
                                                                diffInSeconds /
                                                                    86400
                                                            );
                                                            return `${days} day${days !== 1 ? 's' : ''} ago`;
                                                        }
                                                    })()}
                                                </Text>
                                            </Flex>
                                        </Flex>
                                    </Box>

                                    {userId === post.userId && (
                                        <PostOptionsDropdown post={post} />
                                    )}
                                </Flex>
                                <Text
                                    as="p"
                                    size={{ initial: '3', md: '2' }}
                                    mb="2"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                            </Box>

                            {index !== feedPosts.length - 1 && (
                                <Separator my="5" size="4" color="gray" />
                            )}
                        </Box>
                    ))}
                </Box>
            </Box>
            <Outlet />
        </>
    );
}

function PostOptionsDropdown({ post }: { post: Post }) {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <MoreVertical size={16} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item>
                    <NavLink to={`/feed/post/${post.id}/update`}>
                        <Flex gap={'2'} align='center'>
                            <Edit3 size={16} color='blue' /> Edit Post
                        </Flex>
                    </NavLink>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                    <NavLink to={`/feed/post/${post.id}/delete`}>
                        <Flex gap={'2'} align='center'>
                            <Trash2 size={16} color='red' /> Delete Post
                        </Flex>
                    </NavLink>
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}
