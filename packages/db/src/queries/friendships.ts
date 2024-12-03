import { db } from '@campusconnect/db';
import {
    friendships,
    users,
    FriendRequestStatus,
} from '@campusconnect/db/schema';
import { InferSelectModel, and, eq } from 'drizzle-orm';
import { unionAll } from 'drizzle-orm/pg-core';

/* Docs
 * https://www.coderbased.com/p/user-friends-system-and-database
 */

// Most functions can be tested with the following cases:
// uid1 < uid2 && uid1 == actor
// uid1 < uid2 && uid2 == actor
// uid1 > uid2 && uid1 == actor
// uid1 > uid2 && uid2 == actor

/**
 * Inserts a friend request into the friendships table
 * @param uid1 - user id 1
 * @param uid2 - user id 2
 * @param actor - the user who is sending the friend request
 */
export async function insertFriendRequest(
    uid1: number,
    uid2: number,
    actor: number
) {
    if (uid1 < uid2 && actor == uid1) {
        await db.insert(friendships).values({
            uid1,
            uid2,
            status: FriendRequestStatus.REQ_UID1,
        });
    } else if (uid1 < uid2 && actor == uid2) {
        await db.insert(friendships).values({
            uid1,
            uid2,
            status: FriendRequestStatus.REQ_UID2,
        });
    } else if (uid1 > uid2 && actor == uid1) {
        await db.insert(friendships).values({
            uid1: uid2,
            uid2: uid1,
            status: FriendRequestStatus.REQ_UID2,
        });
    } else {
        await db.insert(friendships).values({
            uid1: uid2,
            uid2: uid1,
            status: FriendRequestStatus.REQ_UID1,
        });
    }
}

/**
 * Reject/deletes a friend request from the friendships table
 * @param uid1 - user id 1
 * @param uid2 - user id 2
 * @param actor - the user who is canceling the friend request
 */
export async function deleteFriendRequest(
    uid1: number,
    uid2: number,
    actor: number
) {
    if (uid1 < uid2 && actor == uid1) {
        // uid1 < uid2 && uid1 == actor
        await db
            .delete(friendships)
            .where(
                and(
                    eq(friendships.uid1, uid1),
                    eq(friendships.uid2, uid2),
                    eq(friendships.status, FriendRequestStatus.REQ_UID1)
                )
            );
    } else if (uid1 < uid2 && actor == uid2) {
        // uid1 < uid2 && uid2 == actor
        await db
            .delete(friendships)
            .where(
                and(
                    eq(friendships.uid1, uid1),
                    eq(friendships.uid2, uid2),
                    eq(friendships.status, FriendRequestStatus.REQ_UID2)
                )
            );
    } else if (uid1 > uid2 && actor == uid1) {
        // uid1 > uid2 && uid1 == actor
        await db
            .delete(friendships)
            .where(
                and(
                    eq(friendships.uid1, uid2),
                    eq(friendships.uid2, uid1),
                    eq(friendships.status, FriendRequestStatus.REQ_UID2)
                )
            );
    } else {
        // uid1 > uid2 && uid2 == actor
        await db
            .delete(friendships)
            .where(
                and(
                    eq(friendships.uid1, uid2),
                    eq(friendships.uid2, uid1),
                    eq(friendships.status, FriendRequestStatus.REQ_UID1)
                )
            );
    }
}

/**
 * Get friend IDs
 * @param uid1 - the user id to get friends for
 * @returns list of friends ID's
 */
export async function getFriendsIDs(uid1: number) {
    // uid1 === friendships.uid1
    const firstHalf = db
        .select({
            id: friendships.uid2,
        })
        .from(friendships)
        .where(eq(friendships.uid1, uid1));

    // uid1 === friendships.uid2
    const secondHalf = db
        .select({
            id: friendships.uid1,
        })
        .from(friendships)
        .where(eq(friendships.uid2, uid1));

    // Union all
    const result = await unionAll(firstHalf, secondHalf);

    return result;
}

/**
 * Get pending friend requests
 * @param uid1 - user id 1
 * @param uid2 - user id 2
 * @param actor - the user who is sending the friend request
 * @returns uid1, uid2, status
 */
export async function getPendingFriendRequest(
    uid1: number,
    uid2: number,
    actor: number
) {
    let result;
    // uid1 < uid2 && uid1 == actor
    if (uid1 < uid2 && actor == uid1) {
        result = await db
            .select()
            .from(friendships)
            .where(
                and(
                    eq(friendships.uid1, uid1),
                    eq(friendships.uid2, uid2),
                    eq(friendships.status, FriendRequestStatus.REQ_UID2)
                )
            );
    } else if (uid1 < uid2 && actor == uid2) {
        // uid1 < uid2 && uid2 == actor
        result = await db
            .select()
            .from(friendships)
            .where(
                and(
                    eq(friendships.uid1, uid1),
                    eq(friendships.uid2, uid2),
                    eq(friendships.status, FriendRequestStatus.REQ_UID1)
                )
            );
    } else if (uid1 > uid2 && actor == uid1) {
        // uid1 > uid2 && uid1 == actor
        result = await db
            .select()
            .from(friendships)
            .where(
                and(
                    eq(friendships.uid1, uid2),
                    eq(friendships.uid2, uid1),
                    eq(friendships.status, FriendRequestStatus.REQ_UID2)
                )
            );
    } else {
        // uid1 > uid2 && uid2 == actor
        result = await db
            .select()
            .from(friendships)
            .where(
                and(
                    eq(friendships.uid1, uid2),
                    eq(friendships.uid2, uid1),
                    eq(friendships.status, FriendRequestStatus.REQ_UID1)
                )
            );
    }

    if (!result) throw new Error('Friend request not found');

    return result[0];
}

/**
 * Accept friend request
 * @param uid1 - user id 1
 * @param uid2 - user id 2
 * @param actor - the user who is accepting the friend request
 * @returns
 */
export async function acceptFriendRequest(
    uid1: number,
    uid2: number,
    actor: number
) {
    if (uid1 < uid2 && actor === uid1) {
        // uid1 < uid2 && uid1 == actor
        await db
            .update(friendships)
            .set({
                status: FriendRequestStatus.friend,
            })
            .where(
                and(
                    eq(friendships.uid1, uid1),
                    eq(friendships.uid2, uid2),
                    eq(friendships.status, FriendRequestStatus.REQ_UID2)
                )
            );
    } else if (uid1 < uid2 && actor === uid2) {
        // uid1 < uid2 && uid2 == actor
        await db
            .update(friendships)
            .set({
                status: FriendRequestStatus.friend,
            })
            .where(
                and(
                    eq(friendships.uid1, uid1),
                    eq(friendships.uid2, uid2),
                    eq(friendships.status, FriendRequestStatus.REQ_UID1)
                )
            );
    } else if (uid1 > uid2 && actor === uid1) {
        // uid1 > uid2 && uid1 == actor
        await db
            .update(friendships)
            .set({
                status: FriendRequestStatus.friend,
            })
            .where(
                and(
                    eq(friendships.uid1, uid2),
                    eq(friendships.uid2, uid1),
                    eq(friendships.status, FriendRequestStatus.REQ_UID2)
                )
            );
    } else {
        // uid1 > uid2 && uid2 == actor
        await db
            .update(friendships)
            .set({
                status: FriendRequestStatus.friend,
            })
            .where(
                and(
                    eq(friendships.uid1, uid2),
                    eq(friendships.uid2, uid1),
                    eq(friendships.status, FriendRequestStatus.REQ_UID1)
                )
            );
    }
}

/**
 * Remove/deletes a friend from the friendships table
 * @param fromId
 * @param toId
 */
export async function removeFriend(uid1: number, uid2: number) {
    if (uid1 < uid2) {
        await db
            .delete(friendships)
            .where(
                and(
                    eq(friendships.uid1, uid1),
                    eq(friendships.uid2, uid2),
                    eq(friendships.status, FriendRequestStatus.friend)
                )
            );
    } else {
        await db
            .delete(friendships)
            .where(
                and(
                    eq(friendships.uid1, uid2),
                    eq(friendships.uid2, uid1),
                    eq(friendships.status, FriendRequestStatus.friend)
                )
            );
    }
}

export type UserFriend = InferSelectModel<typeof friendships>;
