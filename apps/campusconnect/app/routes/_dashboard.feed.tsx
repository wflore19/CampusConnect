import { Box, Flex, Heading, TextArea, Button } from '@radix-ui/themes';
import { ActionFunctionArgs, LoaderFunction } from '@remix-run/node';
import { Outlet, useFetcher, useLoaderData, Form } from '@remix-run/react';
import { RiEditLine } from '@remixicon/react';
import React from 'react';
import { getFriendsList } from '~/modules/friends/friends.core';
import { createPost, getPostsById, getTotalPostsCount } from '~/modules/posts/posts.core';
import { Post, Posts } from '~/modules/posts/posts.types';
import { NewsFeed } from '~/modules/posts/posts.ui';
import { getSession, user } from '~/utils/session.server';

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request);
    const userId = user(session);

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);

    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const feedPosts = await getPostsById(userId, limit, offset);
    const totalPosts = await getTotalPostsCount(userId); // Ensure this function is implemented in your backend

    return {
        userId,
        feedPosts,
        hasMore: offset + limit < totalPosts, // Check if there are more posts to load
    };
};

type ActionData = {
    feedPosts: Posts; // Replace 'Posts' with the correct type for posts in your app
    hasMore: boolean;
};


export default function Feed() {    
    const { feedPosts: initialPosts, userId, hasMore: initialHasMore } = useLoaderData<typeof loader>();
    const fetcher = useFetcher<ActionData>();
    const [allPosts, setAllPosts] = React.useState<Posts>(initialPosts);
    const [hasMore, setHasMore] = React.useState<boolean>(initialHasMore);
    const [page, setPage] = React.useState(1);
    const [textAreaValue, setTextAreaValue] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        const formData = new FormData(event.currentTarget);
        const content = formData.get("content");
    
        if (!content) return;
    
        fetcher.submit(event.currentTarget, { method: "post" });
        setTextAreaValue('');
    }; 

    const loadMorePosts = () => {
        if (!hasMore || isLoading) return; // Prevent redundant loads
        setIsLoading(true);
        fetcher.load(`/feed?page=${page + 1}`);
    };
    
    React.useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data) {
            const { feedPosts, hasMore: newHasMore } = fetcher.data;
    
            if (feedPosts && feedPosts.length > 0) {
                setAllPosts((prevPosts) => {
                    // Merge posts and ensure uniqueness
                    const mergedPosts: Post[] = [...prevPosts, ...feedPosts].reduce((acc: Post[], post) => {
                        if (!acc.some((p) => p.id === post.id)) {
                            acc.push(post);
                        }
                        return acc;
                    }, []);
    
                    // Sort posts by creation date (newest first)
                    return mergedPosts.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
                });
            }
    
            setPage((prevPage) => prevPage + 1); // Increment page
            setHasMore(newHasMore); // Update hasMore
            setIsLoading(false); // Reset loading state
        }
    }, [fetcher.state, fetcher.data]);
    
         
    
    return (
        <React.Fragment>
            <Box>
                <Heading size="6" mb="4">
                    Feed
                </Heading>

                <Box>
                    <Box mb="5">
                        <Form method="post" onSubmit={handleSubmit}>
                            <Flex direction="column" gap="2">
                                <TextArea
                                    name="content"
                                    size="3"
                                    placeholder="What's on your mind?"
                                    value={textAreaValue}
                                    onChange={(event) => setTextAreaValue(event.target.value)}
                                />
                                <Box style={{ textAlign: 'right', width: '100%' }}>
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

                    <NewsFeed feedPosts={allPosts} userId={userId} />

                    {hasMore && (
                        <Box mt="5" style={{ textAlign: 'center' }}>
                            <Button
                                onClick={loadMorePosts}
                                variant="solid"
                                size="3"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Loading...' : 'Load More'}
                            </Button>
                        </Box>
                    )}
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
        const newPost = await createPost(userId, content); // Ensure the full post object is returned
        const totalPosts = await getTotalPostsCount(userId);

        return {
            feedPosts: [newPost],
            hasMore: totalPosts > 1, // Adjust based on total posts count
        };
    } catch (error) {
        return { feedPosts: [], hasMore: false, error: (error as Error).message };
    }
}


