import { sql, type Kysely } from 'kysely';
import { DB } from '../dist/db';

export async function up(db: Kysely<DB>) {
    await sql`
            CREATE TABLE new_users (
               created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
               updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
               id SERIAL PRIMARY KEY,
               first_name VARCHAR(255),
               last_name VARCHAR(255),
               email VARCHAR(255),
               profile_picture VARCHAR(255)
            );

            INSERT INTO new_users (first_name, last_name, email, profile_picture, created_at, updated_at)
            SELECT first_name, last_name, email, image_url, created_at, updated_at
            FROM users;

            DROP TABLE users;

            ALTER TABLE new_users
            RENAME TO users;
            `.execute(db);
}

export async function down(db: Kysely<DB>) {
    await sql`
            CREATE TABLE new_users (
               id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
               email TEXT NOT NULL UNIQUE DEFAULT '',
               first_name VARCHAR(255),
               last_name VARCHAR(255),
               image_url TEXT,
               created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
               updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            INSERT INTO new_users (email, first_name, last_name, image_url, created_at, updated_at)
            SELECT email, first_name, last_name, profile_picture, created_at, updated_at
            FROM users;

            DROP TABLE users;

            ALTER TABLE new_users RENAME TO users;
      `.execute(db);
}
