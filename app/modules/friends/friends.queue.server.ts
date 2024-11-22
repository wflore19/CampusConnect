import { createQueue, createWorker } from '~/utils/bullmq';
import { sendFriendRequest } from './friends.core';

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
 * console.log(result); // { processed: true, fromId: 1, toId: 2 }
 */
createWorker(FRIEND_REQUEST_QUEUE, async (job) => {
    const { fromId, toId } = job.data;
    console.log(`Processing friend request from ${fromId} to ${toId}`);
    try {
        await sendFriendRequest(fromId, toId);
        console.log(`Processed friend request from ${fromId} to ${toId}`);
        return { processed: true, fromId, toId };
    } catch (error) {
        console.error('Error processing friend request:', error);
        return {
            processed: false,
            fromId,
            toId,
            error: (error as Error).message,
        };
    }
});

/**
 * Queue a friend request to be sent
 * @param fromId The ID of the user sending the request
 * @param toId The ID of the user receiving the request
 */
export async function queueFriendRequest(fromId: number, toId: number) {
    return friendRequestQueue.add('send', { fromId, toId });
}
