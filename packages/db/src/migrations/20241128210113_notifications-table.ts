import { sql, type Kysely } from 'kysely';
import { DB } from '../dist/db';

export async function up(db: Kysely<DB>) {
    await sql`
        CREATE TYPE notification_type AS ENUM ('friend_request', 'like', 'comment');
    `.execute(db);

    await sql`
        CREATE TABLE notifications (
            id SERIAL PRIMARY KEY,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            type notification_type NOT NULL,
            message TEXT NOT NULL
        );
    `.execute(db);

    await sql`
        CREATE TABLE user_notifications (
            id SERIAL PRIMARY KEY,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            notification_id INT NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
            user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            read BOOLEAN NOT NULL DEFAULT FALSE,
            UNIQUE(user_id, notification_id)
        );
    `.execute(db);
}

export async function down(db: Kysely<DB>) {
    await sql`
        DROP TABLE user_notifications;
        DROP TABLE notifications;
        DROP TYPE notification_type;
    `.execute(db);
}
