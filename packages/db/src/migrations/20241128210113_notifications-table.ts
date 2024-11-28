import { sql, type Kysely } from 'kysely';
import { DB } from '../dist/db';

export async function up(db: Kysely<DB>) {
    await sql`
        CREATE TABLE notifications (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            message TEXT NOT NULL,
            read BOOLEAN NOT NULL DEFAULT FALSE
        );
    `.execute(db);
}

export async function down(db: Kysely<DB>) {
    await sql`
        DROP TABLE notifications;
    `.execute(db);
}
