import { Box, Flex, Heading, TextArea, Button } from '@radix-ui/themes';
import { ActionFunctionArgs, LoaderFunction } from '@remix-run/node';
import { Outlet, useFetcher, useLoaderData, Form } from '@remix-run/react';
import { RiEditLine } from '@remixicon/react';
import React from 'react';
import { getFriendsList } from '~/modules/friends/friends.core';
import { createPost, getPostsById } from '~/modules/posts/posts.core';
import { Post, Posts } from '~/modules/posts/posts.types';
import { NewsFeed } from '~/modules/posts/posts.ui';
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
        <React.Fragment>
            <Box>
                <Heading size="8" mb="6">
                    Feed
                </Heading>

                {/* Post Form */}
                <Box>
                    <Box mb={'5'}>
                        <Form method="post" onSubmit={handleSubmit}>
                            <Flex direction="column" gap="2">
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
                                        variant="solid"
                                        size={{ initial: '3', md: '2' }}
                                        disabled={!textAreaValue}
                                    >
                                        <RiEditLine size={20} /> Post
                                    </Button>
                                </Box>
                            </Flex>
                        </Form>
                    </Box>
                    {/* Posts Feed */}
                    <NewsFeed feedPosts={feedPosts} userId={userId} />
                </Box>
            </Box>
            <Outlet />
        </React.Fragment>
    );
}

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
