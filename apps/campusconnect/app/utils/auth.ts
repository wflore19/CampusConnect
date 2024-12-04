// OAuth 2.0
import { Session, redirect } from '@remix-run/node';
import {
    User,
    createUser,
    getUserByEmail,
    getUserById,
    insertUserDetails,
    updateUser,
    updateUserDetails,
} from '@campusconnect/db';
import { google } from 'googleapis';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, APP_URL } from '~/utils/env';
import { uploadImageToSpaces } from './s3-config.server';
import { commitSession } from './session.server';

export type GoogleUserType = {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name?: string;
    picture: string;
};

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
export function getGoogleAuthURL(): string {
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
 * @param accessToken - The user's access token
 * @param refreshToken - The user's refresh token
 * @returns {<Promise<GoogleUserType>>} The Google user's profile information
 */
export async function getGoogleProfileInformation(
    accessToken: string,
    refreshToken: string
) {
    GoogleClient.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    try {
        const response = await GoogleClient.request({
            url: 'https://www.googleapis.com/oauth2/v2/userinfo',
        });

        const data = response.data as GoogleUserType;

        return data;
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

/**
 * Exchange the code from Google for the user's tokens after consent screen is shown
 * @param code - The code sent from Google Consent Screen
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
 * @param id - The user ID
 * @param session - The session object
 * @returns A redirect response
 */
export async function loginUser(id: number, session: Session) {
    session.set('user_id', id);

    const user = await getUserById(id);

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
export async function signupNewUser(
    googleUser: GoogleUserType,
    session: Session
) {
    const parsedFirstName = googleUser.name.split(' ')[0];
    const parsedLastName =
        googleUser.name.split(' ')[googleUser.name.split(' ').length - 1];

    const user = await createUser(
        googleUser.email,
        parsedFirstName,
        parsedLastName
    );

    await insertUserDetails(user[0].insertedId);

    const profilePictureUrl = await uploadImageToSpaces(
        googleUser.picture,
        `${parsedFirstName}-${parsedLastName}-${user[0].insertedId.toString()}.jpg`
    );

    const profilePictureCDNurl = profilePictureUrl.replace(
        'nyc3.digitaloceanspaces',
        'nyc3.cdn.digitaloceanspaces'
    );

    await updateUser(user[0].insertedId.toString(), {
        profilePicture: profilePictureCDNurl,
        backupProfilePicture: profilePictureUrl,
    });

    session.set('user_id', user[0].insertedId.toString());
    const redirectUrl = new URL(`${APP_URL}/home`);
    return redirect(redirectUrl.toString(), {
        headers: {
            'Set-Cookie': await commitSession(session),
        },
    });
}
