import { Link, useFetcher } from '@remix-run/react';
import { Box, Button, Flex, Spinner } from '@radix-ui/themes';
import React from 'react';
import {
    RiUserAddLine,
    RiUserMinusLine,
    RiUserUnfollowLine,
} from '@remixicon/react';
import { Friendship } from '@campusconnect/db';
import { FriendshipStatus } from '@campusconnect/db/schema';

type FetcherData = {
    success: boolean;
    type: 'add' | 'remove';
};

export interface FriendshipStatusControlProps {
    friendship?: Friendship;
    userId: number;
    id: number;
}

export function FriendshipStatusControl({
    friendship,
    userId,
    id,
}: FriendshipStatusControlProps) {
    const fetcher = useFetcher<FetcherData>();

    if (!friendship) {
        return (
            <fetcher.Form
                action={`/api/friend-request/${id}/add`}
                method="post"
            >
                <input type="hidden" name="id" value={id} />
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

    const isFriend = friendship!.status === FriendshipStatus.FRIEND;
    if (isFriend) {
        return (
            <Box>
                <Link to={`/user/${id}/remove`}>
                    <Button color="red">
                        <RiUserMinusLine size={18} /> Remove Friend
                    </Button>
                </Link>
            </Box>
        );
    }

    const isPendingForUser =
        (userId < id && friendship!.status === FriendshipStatus.REQ_UID2) ||
        (userId > id && friendship!.status === FriendshipStatus.REQ_UID1);

    if (isPendingForUser) {
        return (
            <Flex gap="2" direction={{ initial: 'column', sm: 'row' }}>
                <fetcher.Form
                    action={`/api/friend-request/${id}/accept`}
                    method="post"
                >
                    <Button type="submit" color="green">
                        <RiUserAddLine size={18} /> Accept Friend Request
                    </Button>
                </fetcher.Form>
                <fetcher.Form
                    action={`/api/friend-request/${id}/reject`}
                    method="post"
                >
                    <Button type="submit" color="red">
                        <RiUserMinusLine size={18} /> Reject Friend Request
                    </Button>
                </fetcher.Form>
            </Flex>
        );
    }

    if (fetcher.data?.type === 'add' || !isPendingForUser) {
        return (
            <fetcher.Form
                action={`/api/friend-request/${id}/cancel`}
                method="post"
            >
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
}
