import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

export * from './queries/events.queries';
export * from './queries/friends.queries';
export * from './queries/posts.queries';
export * from './queries/users.queries';
export const db = drizzle(process.env.DATABASE_URL!);
