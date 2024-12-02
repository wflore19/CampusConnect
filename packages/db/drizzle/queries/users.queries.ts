import { db } from '@campusconnect/db';
import { InferColumnsDataTypes, InferSelectModel, eq, ne } from 'drizzle-orm';
import { users, userDetails } from '@campusconnect/db/schema';

/**
 * Get a list of users, excluding the current user (id)
 * @param id
 * @returns Promise<User[]>
 */
export async function getUsersList(id: number) {
    const usersList = await db
        .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            profilePicture: users.profilePicture,
        })
        .from(users)
        .where(ne(users.id, id));

    if (!usersList) throw new Error('Users not found');

    return usersList;
}

/**
 * Get a user by ID
 * @param id
 * @returns Promise<User>
 */
export async function getUserById(id: number) {
    const userData = await db
        .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            profilePicture: users.profilePicture,
        })
        .from(users)
        .where(eq(users.id, id));

    if (!userData) throw new Error('User not found');

    return userData[0];
}

/**
 * Get a user by email
 * @param email
 * @returns Promise<User>
 */
export async function getUserByEmail(email: string) {
    const userData = await db
        .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            profilePicture: users.profilePicture,
        })
        .from(users)
        .where(eq(users.email, email));

    if (!userData) throw new Error('User not found');

    return userData[0];
}

/**
 * Get user details
 * @param id - User ID
 * @returns Promise<UserDetails>
 */
export async function getUserDetails(id: number) {
    const userDetailsData = await db
        .select({
            userId: userDetails.id,
            sex: userDetails.sex,
            relationshipStatus: userDetails.relationshipStatus,
            age: userDetails.age,
            birthday: userDetails.birthday,
            hometown: userDetails.hometown,
            interests: userDetails.interests,
            favoriteMovies: userDetails.favoriteMovies,
            favoriteMusic: userDetails.favoriteMusic,
            favoriteBooks: userDetails.favoriteBooks,
            aboutMe: userDetails.aboutMe,
            school: userDetails.school,
            work: userDetails.work,
        })
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
    userDetailsArgs: Partial<UserDetails>
) {
    const exists = await db
        .select()
        .from(userDetails)
        .where(eq(userDetails.userId, id));

    if (exists[0]) {
        if (Object.keys(userDetailsArgs).length === 0) {
            return exists[0]; // Return existing record if no updates
        }

        const userDetailsData = await db
            .update(userDetails)
            .set(userDetailsArgs)
            .where(eq(userDetails.userId, id));

        return userDetailsData;
    }

    // For new inserts, just insert with userId
    const userDetailsData = await db.insert(userDetails).values({
        userId: id,
        // Add any other required fields with null/default values
        aboutMe: null,
        sex: null,
        age: null,
        birthday: null,
        favoriteBooks: null,
        favoriteMovies: null,
        favoriteMusic: null,
        hometown: null,
        interests: null,
        relationshipStatus: null,
        school: null,
        work: null,
        ...userDetailsArgs,
    });

    return userDetailsData;
}

/**
 * Update user information if passed in data
 * @param id - User ID
 * @param data - User information
 * @returns Promise<User>
 */
export async function updateUser(id: number, data: Partial<User>) {
    const insertData: Record<string, any> = {};

    if (data.firstName) insertData.firstName = data.firstName;
    if (data.lastName) insertData.lastName = data.lastName;
    if (data.email) insertData.email = data.email;
    if (data.profilePicture) insertData.profilePicture = data.profilePicture;

    const userData = await db
        .update(users)
        .set(insertData)
        .where(eq(users.id, id));

    if (!userData) throw new Error('User not found');

    return userData;
}

/**
 * Create a user & user details
 * @param data - User information
 * @returns Promise<User>
 */
export async function createUser(data: Partial<User>) {
    const insertData: Record<string, any> = {};

    if (data.firstName) insertData.firstName = data.firstName;
    if (data.lastName) insertData.lastName = data.lastName;
    if (data.email) insertData.email = data.email;
    if (data.profilePicture) insertData.profilePicture = data.profilePicture;

    const userData = await db.insert(users).values(insertData).returning({
        id: users.id,
    });

    const userDetailsData = await db.insert(userDetails).values({
        userId: userData[0].id,
    });

    return userData;
}

export type User = InferSelectModel<typeof users>;
export type UserDetails = InferSelectModel<typeof userDetails>;
