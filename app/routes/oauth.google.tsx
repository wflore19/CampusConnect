import type { LoaderFunction } from '@remix-run/node';
import { redirect, Session } from '@remix-run/node';
import { db } from 'db/src';
import { getGoogleUser } from '~/utils/auth';
import { APP_URL } from '~/utils/env';
import { uploadImageFromCDN } from '~/utils/s3-config.server';
import { commitSession, getSession } from '~/utils/session.server';

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const session = await getSession(request);

    if (!code) {
        session.flash('error', 'Google did not return a code');
        return redirect('/login');
    }

    try {
        // Fetch Google user data
        const googleUser: GoogleUser = await getGoogleUser(code);

        // Check if user exists
        const existingUser = await findUserByEmail(googleUser.email);

        if (!existingUser) return signupNewUser(googleUser, session);

        return loginExistingUser(existingUser, session);
    } catch (error) {
        throw new Error('Failed to authenticate Google user');
    }
};

// Define types for better type safety
interface GoogleUser {
    email: string;
    name: string;
    picture: string;
}

interface User {
    name: string;
    createdAt: Date | null;
    id: string;
    imageUrl: string | null; // Change this to allow null
    location: string | null;
    updatedAt: Date | null;
    email: string;
    interests: string[] | null;
    major: string;
    year: string;
}

/**
 * Find a user by their email
 * @param email - The email of the user
 * @returns The user object if found, otherwise undefined
 */
async function findUserByEmail(email: string): Promise<User | undefined> {
    const userProfile = await db
        .selectFrom('users')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirst();

    return userProfile;
}

/**
 * Logs in an existing user and redirects them to the home page
 * @param user - The user object
 * @param session - The session object
 * @returns A redirect response
 */
async function loginExistingUser(user: User, session: Session) {
    session.set('user_id', user.id);

    const redirectUrl = new URL(`${APP_URL}/home`);
    return redirect(redirectUrl.toString(), {
        headers: {
            'Set-Cookie': await commitSession(session),
        },
    });
}

/**
 * Signs up a new user, adds them to the database, and redirects them to the home page
 * @param googleUser - The Google user object
 * @param session - The session object
 * @returns A redirect response
 */
async function signupNewUser(googleUser: GoogleUser, session: Session) {
    const imageUrl = await uploadAndProcessImage(googleUser);
    const newUser = await createNewUser(googleUser, imageUrl);

    session.set('user_id', newUser.id);

    const redirectUrl = new URL(`${APP_URL}/home`);
    return redirect(redirectUrl.toString(), {
        headers: {
            'Set-Cookie': await commitSession(session),
        },
    });
}

/**
 * Uploads the image from the Google user to DigitalOcean Spaces
 * @param googleUser - The Google user object
 * @returns The URL of the uploaded image
 */
async function uploadAndProcessImage(googleUser: GoogleUser): Promise<string> {
    const spacesImageUrl = await uploadImageFromCDN(
        googleUser.picture,
        `${googleUser.email}-${new Date().toISOString()}.png`
    );

    if (!spacesImageUrl) {
        throw new Error('Failed to upload image');
    }

    return spacesImageUrl.replace(
        'nyc3.digitaloceanspaces',
        'nyc3.cdn.digitaloceanspaces'
    );
}

// TSDocs
/**
 * Create a new user in the database
 * @param googleUser - The Google user object
 * @param imageUrl - The URL of the image
 * @returns The user object if created successfully
 */
async function createNewUser(
    googleUser: GoogleUser,
    imageUrl: string
): Promise<User> {
    await db
        .insertInto('users')
        .values({
            email: googleUser.email,
            imageUrl: imageUrl,
            interests: [],
            location: '',
            major: '',
            name: googleUser.name,
            year: '',
        })
        .execute();

    const newUser = await findUserByEmail(googleUser.email);

    if (!newUser) {
        throw new Error('Failed to create new user');
    }

    return newUser;
}
