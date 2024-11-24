import { Form, useFetcher } from '@remix-run/react';
import { Button, Flex } from '@radix-ui/themes';
import { FriendshipStatusControlProps } from './friends.types';
type FetcherData = {
    success: boolean;
    type: 'add' | 'remove';
};
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
                        Accept Friend Request
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
                        Reject Friend Request
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
                <Button type="submit" disabled={fetcher.state !== 'idle'}>
                    {fetcher.state === 'idle'
                        ? 'Cancel Friend Request'
                        : 'Cancelling...'}
                </Button>
            </fetcher.Form>
        );
    }

    if (isFriend) {
        return (
            <fetcher.Form action={`/api/friend/remove/${userId}`} method="post">
                <input type="hidden" name="id" value={userId} />
                <Button type="submit" disabled={fetcher.state !== 'idle'}>
                    {fetcher.state === 'idle' ? 'Remove Friend' : 'Removing...'}
                </Button>
            </fetcher.Form>
        );
    }

    return (
        <fetcher.Form action={`/api/friend-request/${userId}`} method="post">
            <input type="hidden" name="id" value={userId} />
            <input type="hidden" name="status" value="sending" />
            <Button
                type="submit"
                color="blue"
                disabled={fetcher.state !== 'idle'}
            >
                {fetcher.state === 'idle' ? 'Add Friend' : 'Sending...'}
            </Button>
        </fetcher.Form>
    );
}
