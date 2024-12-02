// OAuth 2.0
import { Session, redirect } from '@remix-run/node';
import {
    createUser,
    getUserByEmail,
    updateUser,
    updateUserDetails,
} from '@campusconnect/db';
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
    family_name?: string;
    picture: string;
};

interface User {
    id: number;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    profilePicture: string | null;
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
export async function getGoogleUser(code: string) {
    const { accessToken, refreshToken } = await exchangeCodeForToken(code);
    GoogleClient.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    try {
        const { data }: { data: GoogleUser } = await GoogleClient.request({
            url: 'https://www.googleapis.com/oauth2/v2/userinfo',
        });

        return data;
    } catch (error) {
        throw new Error((error as Error).message);
    }
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
    const newUser = await createNewGoogleUser(googleUser);
    const profilePicture = await uploadImageS3(
        googleUser,
        newUser.id.toString()
    );

    await updateUser(newUser.id, { profilePicture: profilePicture });

    session.set('user_id', newUser.id);

    const redirectUrl = new URL(`${APP_URL}/home`);
    return redirect(redirectUrl.toString(), {
        headers: {
            'Set-Cookie': await commitSession(session),
        },
    });

    /**
     * Create a new user in the database
     * @param googleUser - The Google user object
     * @param imageUrl - The URL of the image
     * @returns The user object if created successfully
     */
    async function createNewGoogleUser(googleUser: GoogleUser) {
        const parsedFirstName = googleUser.name.split(' ')[0];
        const parsedLastName =
            googleUser.name.split(' ')[googleUser.name.split(' ').length - 1];

        await createUser({
            email: googleUser.email,
            firstName: parsedFirstName,
            lastName: parsedLastName,
        });

        const newUser = await getUserByEmail(googleUser.email);

        if (!newUser) {
            throw new Error('Failed to create new user');
        }

        await updateUserDetails(newUser.id, {});

        return newUser;
    }
}

/**
 * Uploads an image to DigitalOcean Spaces (AWS S3)
 * @param googleUser - The Google user object
 * @returns The URL of the uploaded image
 */
export async function uploadImageS3(googleUser: GoogleUser, userId: string) {
    const parsedFirstName = googleUser.name.split(' ')[0];
    const parsedLastName =
        googleUser.name.split(' ')[googleUser.name.split(' ').length - 1];
    const spacesImageUrl = await uploadImageFromCDN(
        googleUser.picture,
        `${parsedFirstName}-${parsedLastName}-${userId}.jpg`
    );

    if (!spacesImageUrl) {
        throw new Error('Failed to upload image');
    }

    return spacesImageUrl.replace(
        'nyc3.digitaloceanspaces',
        'nyc3.cdn.digitaloceanspaces'
    );
}
