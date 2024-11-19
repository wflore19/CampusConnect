import { sql, type Kysely } from 'kysely';
import { DB } from '../dist/db';

export async function up(db: Kysely<DB>) {
    await sql`
            CREATE TABLE new_events (
               created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
               updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
               id SERIAL PRIMARY KEY,
               name VARCHAR(255) DEFAULT '', 
               date DATE,
               location VARCHAR(255) DEFAULT '',
               start_time TIMESTAMP WITH TIME ZONE,
               end_time TIMESTAMP WITH TIME ZONE,
               image_url VARCHAR(255),
               organizer_id INTEGER REFERENCES users(id),
               description TEXT DEFAULT ''
            );

            DROP TABLE events;

            ALTER TABLE new_events
            RENAME TO events;
            `.execute(db);
}

export async function down(db: Kysely<DB>) {
    await sql`
            CREATE TABLE new_events (
               id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
               title TEXT NOT NULL,
               date TEXT NOT NULL,
               time TEXT NOT NULL,
               location TEXT NOT NULL,
               image_url TEXT,
               organization TEXT NOT NULL DEFAULT '',
               created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
               updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            DROP TABLE events;

            ALTER TABLE new_events RENAME TO events;
      `.execute(db);
}
