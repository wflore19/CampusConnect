import {
    Box,
    Avatar,
    DropdownMenu,
    Flex,
    Separator,
    Text,
} from '@radix-ui/themes';
import { Post, Posts } from './posts.types';
import React from 'react';
import { getTimeAgo } from './posts.helpers';
import { Link } from '@remix-run/react';
import { RiDeleteBinFill, RiEdit2Line, RiMore2Fill } from '@remixicon/react';

export function NewsFeed({
    feedPosts,
    userId,
}: {
    feedPosts: Posts;
    userId: number;
}) {
    if (!feedPosts.length)
        return (
            <React.Fragment>
                <Text>No posts yet</Text>
            </React.Fragment>
        );

    return (
        <React.Fragment>
            {feedPosts.map((post, index) => (
                <Box key={post.id || index}>
                    <Box width={'full'}>
                        <Flex justify={'between'}>
                            <Box>
                                <Flex gap="3" align="center" mb="2">
                                    <Avatar
                                        size="3"
                                        src={post.profilePicture || undefined}
                                        radius="full"
                                        fallback={
                                            post.firstName[0] + post.lastName[0]
                                        }
                                    />
                                    <Flex
                                        direction="column"
                                        gap={{ initial: '0', md: '1' }}
                                    >
                                        <Link to={`/user/${post.userId}`}>
                                            <Text
                                                size={{
                                                    initial: '4',
                                                    md: '2',
                                                }}
                                                weight="medium"
                                            >
                                                {`${post.firstName} ${post.lastName}`}
                                            </Text>
                                        </Link>
                                        <Text
                                            size={{
                                                initial: '1',
                                                md: '2',
                                            }}
                                        >
                                            {getTimeAgo(post.createdAt)}
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
                            dangerouslySetInnerHTML={{
                                __html: post.content,
                            }}
                        />
                    </Box>

                    {index !== feedPosts.length - 1 && (
                        <Separator my="5" size="4" color="gray" />
                    )}
                </Box>
            ))}
        </React.Fragment>
    );
}

export function PostOptionsDropdown({ post }: { post: Post }) {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Box>
                    <RiMore2Fill size={20} />
                </Box>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" sideOffset={-20}>
                <DropdownMenu.Item asChild>
                    <Link to={`/feed/post/${post.id}/update`}>
                        <Flex gap={'2'} align="center">
                            <RiEdit2Line size={20} /> Edit Post
                        </Flex>
                    </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item asChild>
                    <Link to={`/feed/post/${post.id}/delete`}>
                        <Flex gap={'2'} align="center">
                            <RiDeleteBinFill size={20} color="red" /> Delete
                            Post
                        </Flex>
                    </Link>
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}
