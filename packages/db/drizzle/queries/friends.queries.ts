import { db, friendRequestStatus, userFriend, users } from '@campusconnect/db';
import { InferColumnsDataTypes, InferSelectModel, and, eq } from 'drizzle-orm';

/* Docs
 * https://www.coderbased.com/p/user-friends-system-and-database
 */

/**
 * Send friend request
 * @param fromId
 * @param toId
 * @returns
 */
export async function sendFriendRequest(fromId: number, toId: number) {
    await db.insert(userFriend).values({
        uid1: fromId,
        uid2: toId,
        status: 'REQ_UID1',
    });
}

/** Cancel friend request
 * @param fromId
 * @param toId
 *
 * @example
 * cancelFriendRequest(1, 2)
 */
export async function cancelFriendRequest(fromId: number, toId: number) {
    // First case: fromId -> toId request
    const fromToRequest = await db
        .select()
        .from(userFriend)
        .where(
            and(
                eq(userFriend.uid1, fromId),
                eq(userFriend.uid2, toId),
                eq(userFriend.status, 'REQ_UID1')
            )
        );

    // Second case: toId -> fromId request
    const toFromRequest = await db
        .select()
        .from(userFriend)
        .where(
            and(
                eq(userFriend.uid1, toId),
                eq(userFriend.uid2, fromId),
                eq(userFriend.status, 'REQ_UID2')
            )
        );

    // Combine results and get first match
    const result = [...fromToRequest, ...toFromRequest][0];
    if (!result) {
        throw new Error('Friend request not found');
    }

    // Delete the found request
    await db.delete(userFriend).where(eq(userFriend.id, result.id));
}

/**
 * Get pending friend requests sent to me
 * @param id
 * @returns uid1, uid2, status
 */
export async function getPendingFriendRequest(userId: number, id: number) {
    // First case: id -> userId request
    const idToUserRequest = await db
        .select({
            uid1: userFriend.uid1,
            uid2: userFriend.uid2,
            status: userFriend.status,
        })
        .from(userFriend)
        .where(and(eq(userFriend.uid1, id), eq(userFriend.uid2, userId)));

    // Second case: userId -> id request
    const userToIdRequest = await db
        .select({
            uid1: userFriend.uid1,
            uid2: userFriend.uid2,
            status: userFriend.status,
        })
        .from(userFriend)
        .where(and(eq(userFriend.uid1, userId), eq(userFriend.uid2, id)));

    // Combine results and get first match
    return [...idToUserRequest, ...userToIdRequest][0] || null;
}

/**
 * Get friends list
 * @param id
 * @returns
 */
export async function getFriendsList(id: number) {
    if (!id) throw new Error('User ID not provided');

    const friendsList = await db
        .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            profilePicture: users.profilePicture,
        })
        .from(userFriend)
        .leftJoin(users, eq(users.id, userFriend.uid2))
        .where(and(eq(userFriend.uid1, id), eq(userFriend.status, 'friend')))
        .union(
            db
                .select({
                    id: users.id,
                    firstName: users.firstName,
                    lastName: users.lastName,
                    email: users.email,
                    profilePicture: users.profilePicture,
                })
                .from(userFriend)
                .leftJoin(users, eq(users.id, userFriend.uid1))
                .where(
                    and(
                        eq(userFriend.uid2, id),
                        eq(userFriend.status, 'friend')
                    )
                )
        );

    if (!friendsList) throw new Error('Friends not found');

    return friendsList;
}

/**
 * Accept friend request
 * @param fromId
 * @param toId
 * @returns
 */
export async function acceptFriendRequest(fromId: number, toId: number) {
    const friendRequest = await db
        .update(userFriend)
        .set({
            status: 'friend',
        })
        .where(and(eq(userFriend.uid1, fromId), eq(userFriend.uid2, toId)));

    return friendRequest;
}

/**
 * Reject friend request
 * @param fromId
 * @param toId
 * @returns
 */
export async function rejectFriendRequest(fromId: number, toId: number) {
    const friendRequest = await db
        .delete(userFriend)
        .where(and(eq(userFriend.uid1, fromId), eq(userFriend.uid2, toId)));

    return friendRequest;
}

/** Remove a friend
 * @param fromId
 * @param toId
 * @returns
 *
 * @example
 * removeFriend(1, 2)
 */
export async function removeFriend(fromId: number, toId: number) {
    const result = await db
        .select({
            id: userFriend.id,
        })
        .from(userFriend)
        .where(
            and(
                eq(userFriend.uid1, fromId),
                eq(userFriend.uid2, toId),
                eq(userFriend.status, 'friend')
            )
        )
        .union(
            db
                .select({
                    id: userFriend.id,
                })
                .from(userFriend)
                .where(
                    and(
                        eq(userFriend.uid1, toId),
                        eq(userFriend.uid2, fromId),
                        eq(userFriend.status, 'friend')
                    )
                )
        );

    await db.delete(userFriend).where(eq(userFriend.id, result[0].id));
}

export type UserFriend = InferSelectModel<typeof userFriend>;
