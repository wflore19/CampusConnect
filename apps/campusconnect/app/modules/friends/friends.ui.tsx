import { Form, useFetcher } from '@remix-run/react';
import { Box, Button, Flex, Link, Spinner } from '@radix-ui/themes';
import React from 'react';
import {
    RiUserAddLine,
    RiUserMinusLine,
    RiUserUnfollowLine,
} from '@remixicon/react';
import { UserFriend } from '@campusconnect/db';

type FetcherData = {
    success: boolean;
    type: 'add' | 'remove';
};

export interface FriendshipStatusControlProps {
    friendRequest: UserFriend;
    userId: number;
    id: number;
}

export function FriendshipStatusControl({
    friendRequest,
    userId,
}: FriendshipStatusControlProps) {
    const fetcher = useFetcher<FetcherData>();

    const isPendingForUser =
        (friendRequest?.uid1 === userId &&
            friendRequest?.status === 'REQ_UID1') ||
        (friendRequest?.uid2 === userId &&
            friendRequest?.status === 'REQ_UID2');

    const isRequestSentByUser =
        (friendRequest?.uid1 === userId &&
            friendRequest?.status === 'REQ_UID2') ||
        (friendRequest?.uid2 === userId &&
            friendRequest?.status === 'REQ_UID1');

    const isFriend = friendRequest?.status === 'friend';

    if (isPendingForUser) {
        return (
            <Flex gap="2" direction={{ initial: 'column', sm: 'row' }}>
                <Form
                    action={`/api/friend-request/${userId}`}
                    method="post"
                    navigate={false}
                >
                    <input type="hidden" name="id" value={userId} />
                    <input type="hidden" name="status" value="accepted" />
                    <Button type="submit" color="green">
                        <RiUserAddLine size={18} /> Accept Friend Request
                    </Button>
                </Form>
                <Form
                    action={`/api/friend-request/${userId}`}
                    method="post"
                    navigate={false}
                >
                    <input type="hidden" name="id" value={userId} />
                    <input type="hidden" name="status" value="rejected" />
                    <Button type="submit" color="red">
                        <RiUserMinusLine size={18} /> Reject Friend Request
                    </Button>
                </Form>
            </Flex>
        );
    }

    if (fetcher.data?.type === 'add' || isRequestSentByUser) {
        return (
            <fetcher.Form
                action={`/api/friend-request/${userId}/cancel`}
                method="post"
            >
                <input type="hidden" name="id" value={userId} />
                <Button
                    type="submit"
                    color="red"
                    variant="surface"
                    disabled={fetcher.state !== 'idle'}
                >
                    {fetcher.state === 'idle' ? (
                        <React.Fragment>
                            <RiUserUnfollowLine size={18} /> Cancel Friend
                            Request
                        </React.Fragment>
                    ) : (
                        <Spinner />
                    )}
                </Button>
            </fetcher.Form>
        );
    }

    if (isFriend) {
        return (
            <Box>
                <Link href={`/user/${userId}/remove`}>
                    <Button color="red">
                        <RiUserMinusLine size={18} /> Remove Friend
                    </Button>
                </Link>
            </Box>
        );
    }

    return (
        <fetcher.Form action={`/api/friend-request/${userId}`} method="post">
            <input type="hidden" name="id" value={userId} />
            <input type="hidden" name="status" value="sending" />
            <Button
                type="submit"
                color="indigo"
                variant="surface"
                disabled={fetcher.state !== 'idle'}
            >
                {fetcher.state === 'idle' ? (
                    <React.Fragment>
                        <RiUserAddLine size={18} /> Add Friend
                    </React.Fragment>
                ) : (
                    <Spinner />
                )}
            </Button>
        </fetcher.Form>
    );
}
