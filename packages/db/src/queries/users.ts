import { db } from '@campusconnect/db';
import { InferSelectModel, eq, ne } from 'drizzle-orm';
import { users } from '@campusconnect/db/schema';

export type User = InferSelectModel<typeof users>;

/**
 * Get a list of users, excluding the current user (id)
 * @param id - User ID to exclude
 * @returns {Promise<User[]>} - An array of users
 */
export async function getManyUsers(id?: number) {
    if (!id) {
        return await db.select().from(users);
    }

    const usersList = await db.select().from(users).where(ne(users.id, id));

    if (!usersList) throw new Error('Users not found');

    return usersList;
}

/**
 * Get a user by ID
 * @param id - User ID
 * @returns {Promise<User>} - The user
 */
export async function getUserById(id: number) {
    const userData = await db.select().from(users).where(eq(users.id, id));

    if (!userData) throw new Error('User not found');

    return userData[0];
}

/**
 * Get a user by email
 * @param email - User email
 * @returns {Promise<User>} - The user
 */
export async function getUserByEmail(email: string) {
    const userData = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

    if (!userData) throw new Error('User not found');

    return userData[0];
}
