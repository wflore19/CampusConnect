import { config } from 'dotenv';

config();

if (!process.env.GOOGLE_ANALYTICS) {
    console.warn('Google Analytics ID is not provided');
}

if (!process.env.GOOGLE_CLIENT_ID) {
    console.warn('Google Client ID is not provided');
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('Google Client Secret is not provided');
}

if (!process.env.APP_URL) {
    console.warn('App URL is not provided');
}

if (!process.env.SESSION_SECRET) {
    console.warn('Session Secret is not provided');
}

export const GOOGLE_ANALYTICS = process.env.GOOGLE_ANALYTICS || '';
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
export const APP_URL = process.env.APP_URL || '';
export const SESSION_SECRET = process.env.SESSION_SECRET || '';
