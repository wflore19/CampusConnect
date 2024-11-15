// OAuth 2.0
import { Session, redirect } from '@remix-run/node';
import { db } from 'db/src';
import { google } from 'googleapis';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, APP_URL } from '~/utils/env';
import { uploadImageFromCDN } from './s3-config.server';
import { commitSession } from './session.server';

export type GoogleUser = {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
};

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
 * Google OAuth2 client
 */
const GoogleClient = new google.auth.OAuth2({
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: `${APP_URL}/oauth/google`,
});

/**
 * Get the Google authentication URL for the user to login
 * @returns The Google authentication URL
 */
export function getGoogleAuthURL() {
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
    ];

    return GoogleClient.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: scopes,
    });
}

/**
 * Get the Google user profile information from the code provided by Google
 * @param code - The code from Google
 * @returns The Google user's profile information if found, otherwise undefined
 */
export async function getGoogleUser(code: string): Promise<GoogleUser> {
    const { accessToken, refreshToken } = await exchangeCodeForToken(code);
    GoogleClient.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    const { data } = await GoogleClient.request({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    });

    if (!data) {
        throw new Error('Failed to get Google user');
    }

    // Type guard function to check if the data is a GoogleUser
    function isGoogleUser(user: unknown): user is GoogleUser {
        return (
            typeof user === 'object' &&
            user !== null &&
            'id' in user &&
            'email' in user &&
            'verified_email' in user &&
            'name' in user &&
            'given_name' in user &&
            'family_name' in user &&
            'picture' in user
        );
    }

    if (!isGoogleUser(data)) {
        throw new Error(
            'Failed to get Google user profile information from Google'
        );
    }

    return data;
}

/**
 * Exchange the code from Google for the user's tokens after consent screen is shown
 * @param code - The code from Google
 * @returns The user's tokens
 */
export async function exchangeCodeForToken(code: string) {
    const { tokens } = await GoogleClient.getToken(code);

    return {
        refreshToken: tokens.refresh_token || '',
        accessToken: tokens.access_token || '',
    };
}

/**
 * Find a user by their email
 * @param email - The email of the user
 * @returns The user object if found, otherwise undefined
 */
export async function findUserByEmail(
    email: string
): Promise<User | undefined> {
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
export async function loginExistingUser(user: User, session: Session) {
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
export async function signupNewUser(googleUser: GoogleUser, session: Session) {
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
export async function uploadAndProcessImage(
    googleUser: GoogleUser
): Promise<string> {
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
