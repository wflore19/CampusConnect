import { db } from 'db/src';

/* Get a list of users, excluding the current user (id)
 * @param id
 * @returns Promise<{ id: number; firstName: string; lastName: string; email: string; profilePicture: string; }[]>
 */
export async function getUsersList(id: number) {
    try {
        const users = await db
            .selectFrom('users')
            .select(['id', 'firstName', 'lastName', 'email', 'profilePicture'])
            .where('id', '!=', id)
            .execute();

        return users;
    } catch (error) {
        throw new Error('Failed to load users');
    }
}

/* Get a user by ID
 * @param id
 * @returns Promise<{ id: number; firstName: string; lastName: string; email: string; profilePicture: string; }>
 */
export async function getUserById(id: number) {
    const user = await db
        .selectFrom('users')
        .select(['id', 'email', 'firstName', 'lastName', 'profilePicture'])
        .where('id', '=', id)
        .executeTakeFirst();

    if (!user) {
        throw new Error('User not found');
    }
    return user;
}
