import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

export * from './queries/friendships';
export * from './queries/posts';
export * from './queries/users';
export * from './queries/userDetails';
export const db = drizzle(process.env.DATABASE_URL!);
