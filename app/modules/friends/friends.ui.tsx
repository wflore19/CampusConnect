import { Form } from '@remix-run/react';
import { Text } from '~/components/text';
import { FriendshipStatusControlProps } from './friends.types';

export function FriendshipStatusControl({
    friendRequest,
    userId,
}: FriendshipStatusControlProps) {
    // Receiving the friend request
    const isPendingForUser =
        (friendRequest?.uid1 === userId &&
            friendRequest?.status === 'REQ_UID1') ||
        (friendRequest?.uid2 === userId &&
            friendRequest?.status === 'REQ_UID2');

    // Sending the friend request
    const isRequestSentByUser =
        (friendRequest?.uid1 === userId &&
            friendRequest?.status === 'REQ_UID2') ||
        (friendRequest?.uid2 === userId &&
            friendRequest?.status === 'REQ_UID1');

    const isFriend = friendRequest?.status === 'friend';

    if (isPendingForUser) {
        return (
            <div className="space-x-2">
                <Form
                    action={`/api/friend-request/${userId}`}
                    method="post"
                    navigate={false}
                >
                    <input type="hidden" name="id" value={userId} />
                    <input type="hidden" name="status" value="accepted" />
                    <button
                        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        type="submit"
                    >
                        Accept Friend Request
                    </button>
                </Form>
                <Form
                    action={`/api/friend-request/${userId}`}
                    method="post"
                    navigate={false}
                >
                    <input type="hidden" name="id" value={userId} />
                    <input type="hidden" name="status" value="rejected" />
                    <button
                        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                        type="submit"
                    >
                        Reject Friend Request
                    </button>
                </Form>
            </div>
        );
    }

    if (isRequestSentByUser) {
        return <Text className="font-semibold">Friend Request Sent</Text>;
    }

    if (isFriend) {
        return <Text className="font-semibold">Friends</Text>;
    }

    return (
        <>
            <Form
                action={`/api/friend-request/${userId}`}
                method="post"
                navigate={false}
            >
                <input type="hidden" name="id" value={userId} />
                <input type="hidden" name="status" value="sending" />
                <button
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    type="submit"
                >
                    Add Friend
                </button>
            </Form>
        </>
    );
}
