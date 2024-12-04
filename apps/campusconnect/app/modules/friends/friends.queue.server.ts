import { createQueue, createWorker } from '~/utils/bullmq';
import { insertFriendRequest } from '@campusconnect/db';

const FRIEND_REQUEST_QUEUE = 'friendRequest';

export const friendRequestQueue = createQueue(FRIEND_REQUEST_QUEUE);

/**
 * Process a friend request
 * @param fromId The ID of the user sending the request
 * @param toId The ID of the user receiving the request
 * @returns The result of processing the request
 *
 * @example
 * const result = await processFriendRequest(1, 2);
 */
createWorker(FRIEND_REQUEST_QUEUE, async (job) => {
    const { uid1, uid2 } = job.data;
    try {
        await insertFriendRequest(uid1, uid2, uid1);
        return { processed: true, uid1, uid2 };
    } catch (error) {
        throw new Error('Failed to process friend request');
    }
});

/**
 * Queue a friend request to be sent
 * @param uid1 The user ID of the user sending the request
 * @param uid2 The user ID of the user receiving the request
 */
export async function queueFriendRequest(uid1: number, uid2: number) {
    return friendRequestQueue.add('send', { uid1, uid2 });
}
