import { InferSelectModel, eq } from 'drizzle-orm';
import { userDetails } from '../schema/schema';
import { db } from '@campusconnect/db';

export type UserDetails = InferSelectModel<typeof userDetails>;

/**
 * Get user details
 * @param id - User ID
 * @returns {Promise<UserDetails>} - The user details
 */
export async function getUserDetails(id: number) {
    const userDetailsData = await db
        .select()
        .from(userDetails)
        .where(eq(userDetails.userId, id));

    if (!userDetailsData) throw new Error('User details not found');

    return userDetailsData[0];
}

/**
 * Update user details
 * @param id - User ID
 * @param data - User details
 * @returns Promise<UserDetails>
 */
export async function updateUserDetails(
    id: number,
    userDetailsArgs: Partial<UserDetails> = {}
) {
    if (Object.keys(userDetailsArgs).length === 0) return;

    const userDetailsData = await db
        .update(userDetails)
        .set(userDetailsArgs)
        .where(eq(userDetails.userId, id));

    return userDetailsData;
}

/**
 * Insert new user details record
 * @param id - User ID
 */
export async function insertUserDetails(id: number) {
    await db.insert(userDetails).values({ userId: id });
}
