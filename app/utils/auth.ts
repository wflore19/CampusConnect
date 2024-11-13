// OAuth 2.0
import { match } from 'ts-pattern';
import { z } from 'zod';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    APP_URL,
    JWT_SECRET,
} from '~/utils/env';
import { db } from '../../db/src/shared/db';

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

type HandleLoginInput = {
    query: AuthorizationCodeQuery;
    type: 'google';
};
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
type SignTokenOptions = Partial<{
    expiresIn: string;
}>;
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

export async function handleLogin({ query, type }: HandleLoginInput) {
    const { code, state } = query;

    return match(state)
        .with({ context: 'member_login' }, async () => {
            // Typically workflow for login with google authentication using OAuth2 and Remix
            // 1. Get the user's profile information from Google
            // 2. Check if the user exists in the database
            const { authToken, email } = await loginWithOAuth({
                context: state.context,
                code,
                oauthRedirectUrl: state.oauthRedirectUrl,
                type,
            });

            const url = new URL(state.clientRedirectUrl!);

            if (authToken) {
                url.searchParams.set('token', authToken);
                url.searchParams.set('method', type);
            } else {
                url.searchParams.set(
                    'error',
                    `There was no user found with this email (${email}).`
                );
            }

            return url.toString();
        })
        .with({ context: 'member_signup' }, async () => {
            const googleUser = await getGoogleUser(code);

            if (!googleUser) {
                return { error: 'Failed to get Google user' };
            }

            const url = new URL(state.clientRedirectUrl!);

            // Check if the user already exists
            const existingUser = await db
                .selectFrom('users')
                .select('email')
                .where('email', '=', googleUser.email)
                .executeTakeFirst();

            if (existingUser) {
                url.searchParams.set(
                    'error',
                    'User with this email already exists'
                );
            } else {
                // Create a new user
                await db
                    .insertInto('users')
                    .values({
                        email: googleUser.email,
                        imageUrl: googleUser.picture,
                        interests: [],
                        location: '',
                        major: '',
                        name: googleUser.name,
                        year: '',
                    })
                    .executeTakeFirst();
            }

            return '/home';
        })
        .exhaustive();
}

/**
 * Login with OAuth
 * @param input - The OAuth login input
 * @returns The OAuth login output
 */
export async function loginWithOAuth(input: OAuthLoginInput) {
    const profile = await getGoogleUser(input.code);

    if (!profile) {
        return {
            authToken: '',
            email: '',
        };
    }

    const entity = await db
        .selectFrom('users')
        .select(['id'])
        .where('email', '=', profile.email)
        .executeTakeFirst();

    if (!entity) {
        return {
            authToken: '',
            email: profile.email,
        };
    }

    const authToken = signToken({ id: entity.id }, { expiresIn: '1m' });

    return {
        authToken,
        email: profile.email,
    };
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
export async function getGoogleUser(
    code: string
): Promise<GoogleUser | undefined> {
    const { accessToken, refreshToken } = await exchangeCodeForToken(code);
    GoogleClient.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    const { data } = await GoogleClient.request({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    });

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
        return undefined;
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
 * Sign a token with the provided data
 * @param data - The data to sign
 * @param options - The options for the token
 * @returns The signed token
 */
export function signToken<T extends object>(
    data: T,
    options: SignTokenOptions = {}
): string {
    if (typeof JWT_SECRET !== 'string' || JWT_SECRET.length === 0) {
        throw new Error('JWT_SECRET is not properly configured');
    }
    return jwt.sign(data, JWT_SECRET, options);
}
