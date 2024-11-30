import { Form, useFetcher } from '@remix-run/react';
import { Box, Button, Flex, Link, Spinner } from '@radix-ui/themes';
import { FriendshipStatusControlProps } from './friends.types';
import React from 'react';
import {
    RiUserAddLine,
    RiUserMinusLine,
    RiUserUnfollowLine,
} from '@remixicon/react';
import { useSocket } from '~/utils/socket';
type FetcherData = {
    success: boolean;
    type: 'add' | 'remove';
};
export function FriendshipStatusControl({
    friendRequest,
    userId,
    id,
    socket,
}: FriendshipStatusControlProps) {
    const fetcher = useFetcher<FetcherData>();

    const isPendingForUser =
        (friendRequest?.uid1 === id && friendRequest?.status === 'REQ_UID1') ||
        (friendRequest?.uid2 === id && friendRequest?.status === 'REQ_UID2');

    const isRequestSentByUser =
        (friendRequest?.uid1 === id && friendRequest?.status === 'REQ_UID2') ||
        (friendRequest?.uid2 === id && friendRequest?.status === 'REQ_UID1');

    const isFriend = friendRequest?.status === 'friend';

    if (isPendingForUser) {
        return (
            <Flex gap="2" direction={{ initial: 'column', sm: 'row' }}>
                <Form
                    action={`/api/friend-request/${id}`}
                    method="post"
                    navigate={false}
                >
                    <input type="hidden" name="id" value={id} />
                    <input type="hidden" name="status" value="accepted" />
                    <Button type="submit" color="green">
                        <RiUserAddLine size={18} /> Accept Friend Request
                    </Button>
                </Form>
                <Form
                    action={`/api/friend-request/${id}`}
                    method="post"
                    navigate={false}
                >
                    <input type="hidden" name="id" value={id} />
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
                action={`/api/friend-request/${id}/cancel`}
                method="post"
            >
                <input type="hidden" name="id" value={id} />
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
                <Link href={`/user/${id}/remove`}>
                    <Button color="red">
                        <RiUserMinusLine size={18} /> Remove Friend
                    </Button>
                </Link>
            </Box>
        );
    }

    return (
        <fetcher.Form action={`/api/friend-request/${id}`} method="post">
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="status" value="sending" />
            <Button
                type="submit"
                color="indigo"
                variant="surface"
                disabled={fetcher.state !== 'idle'}
                onClick={() => {
                    socket.emit('friend-request', {
                        fromUID: userId,
                        toUID: id,
                        type: 'friend-request',
                        message: 'Friend Request',
                    });
                }}
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
