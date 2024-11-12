import { config } from 'dotenv';

config()

if (!process.env.GOOGLE_ANALYTICS) {
   console.warn('Google Analytics ID is not provided');
}

export const GOOGLE_ANALYTICS = process.env.GOOGLE_ANALYTICS;