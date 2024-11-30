import { sql, type Kysely } from 'kysely';
import { DB } from '../../dist/db';

export async function up(db: Kysely<DB>) {
    await sql`
        DROP TABLE friendships
        `.execute(db);
}

export async function down(db: Kysely<DB>) {
    await sql`
        CREATE TABLE friendships (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, friend_id)
        )`.execute(db);
}
