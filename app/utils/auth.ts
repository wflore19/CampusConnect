// OAuth 2.0
import { z } from 'zod';
import { google } from 'googleapis';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, APP_URL } from '~/utils/env';

const OAuthCodeState = z.object({
    clientRedirectUrl: z.string().url(),

    /**
     * This provides context for what the application should do after the user
     * is authenticated. In our case, this will tell us whether we want to lookup
     * an admin record or a student record.
     */
    context: z.enum(['member_login', 'member_signup']),

    oauthRedirectUrl: z.custom<`${string}/oauth/${string}`>((value) => {
        const { success } = z.string().url().safeParse(value);

        return success;
    }),
});

// Types
type OAuthCodeState = z.infer<typeof OAuthCodeState>;

type AuthorizationCodeQuery = z.infer<typeof AuthorizationCodeQuery>;
export type OAuthServiceType = 'google';
export type OAuthLoginInput = {
    context: NonNullable<OAuthCodeState['context']>;
    code: string;
    oauthRedirectUrl: OAuthCodeState['oauthRedirectUrl'];
    type: OAuthServiceType;
};
export type OuthLoginOutput = {
    authToken: string;
    email: string;
};
export type OAuthTokens = {
    accessToken: string;
    refreshToken: string;
};

export type OAuthProfile = {
    email: string;
};

export interface OAuthService {
    exchangeCodeForToken(args: ExchangeCodeForTokenInput): Promise<OAuthTokens>;
    getProfile(token: string): Promise<OAuthProfile>;
}

export type ExchangeCodeForTokenInput = {
    code: string;
    redirectUrl: string;
};

export const AuthorizationCodeQuery = z.object({
    code: z.string().trim().min(1),
    state: z
        .string()
        .optional()
        .transform((value) => JSON.parse(value || '{}'))
        .transform((value) => OAuthCodeState.parse(value)),
});
export type GoogleUser = {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
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
