import { Form } from '@remix-run/react';
import { Button, Flex, Text } from '@radix-ui/themes';
import { FriendshipStatusControlProps } from './friends.types';

export function FriendshipStatusControl({
    friendRequest,
    userId,
}: FriendshipStatusControlProps) {
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
            <Flex gap="2">
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

    if (isRequestSentByUser) {
        return <Text weight="bold">Friend Request Sent</Text>;
    }

    if (isFriend) {
        return <Text weight="bold">Friends</Text>;
    }

    return (
        <Form
            action={`/api/friend-request/${userId}`}
            method="post"
            navigate={false}
        >
            <input type="hidden" name="id" value={userId} />
            <input type="hidden" name="status" value="sending" />
            <Button type="submit" color="blue">
                Add Friend
            </Button>
        </Form>
    );
}
