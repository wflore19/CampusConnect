import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './src/schema',
    migrations: {
        prefix: 'timestamp',
        table: '__drizzle_migrations__',
        schema: 'public',
    },
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
