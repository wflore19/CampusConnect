import { sql, type Kysely } from 'kysely';
import { DB } from '../../dist/db';

export async function up(db: Kysely<DB>) {
    await sql`
         DROP TABLE event_attendees
      `.execute(db);
}

export async function down(db: Kysely<DB>) {
    await sql`
         CREATE TABLE event_attendees (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(event_id, user_id)
         )
      `.execute(db);
}
