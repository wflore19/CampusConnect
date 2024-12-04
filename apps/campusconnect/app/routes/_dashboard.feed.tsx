import { Box, Flex, Heading, TextArea, Button } from '@radix-ui/themes';
import { ActionFunctionArgs, LoaderFunction } from '@remix-run/node';
import { Outlet, useFetcher, useLoaderData, Form } from '@remix-run/react';
import { RiEditLine } from '@remixicon/react';
import React from 'react';
import {
    type Post,
    type FeedPost,
    getPostsByUserId,
    getFriendsIDs,
    insertPost,
} from '@campusconnect/db';
import { NewsFeed } from '~/modules/posts/posts.ui';
import { getSession, user } from '~/utils/session.server';
import { ActionResult } from '~/utils/types';

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request);
    const id = user(session);

    const friendsIds = await getFriendsIDs(id); // [1, 2, 3, 4, 5]
    const feedPosts: FeedPost[] = [];

    for (const item of friendsIds) {
        const friendsPosts = await getPostsByUserId(item.id);

        if (!friendsPosts.length) continue;

        for (const post of friendsPosts) {
            if (!post.content) continue;

            post.content = post.content.replace(/(?:\r\n|\r|\n)/g, '<br>');
            feedPosts.push(post);
        }
    }

    const myPosts = await getPostsByUserId(id);
    for (const post of myPosts) {
        if (!post.content) continue;

        post.content = post.content.replace(/(?:\r\n|\r|\n)/g, '<br>');
        feedPosts.push(post);
    }

    // Sort feed posts by newest first
    if (!feedPosts) return { userId: id, feedPosts: [] };

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
        feedPosts: Post[];
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
    const userId = user(session);

    const formData = await request.formData();
    const content = String(formData.get('content'));

    try {
        await insertPost(userId, content);

        return {};
    } catch (error) {
        return { error: (error as Error).message };
    }
}
