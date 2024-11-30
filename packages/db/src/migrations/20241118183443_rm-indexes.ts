import { sql, type Kysely } from 'kysely';
import { DB } from '../../dist/db';

export async function up(db: Kysely<DB>) {
    await db.schema.dropIndex('idx_events_date').ifExists().execute();

    await db.schema.dropIndex('idx_users_major').ifExists().execute();

    await db.schema.dropIndex('idx_users_year').ifExists().execute();

    await db.schema.dropIndex('idx_users_interests').ifExists().execute();
}

export async function down(db: Kysely<DB>) {
    await sql`
        CREATE INDEX idx_events_date
        ON events (date)
        `.execute(db);

    await sql`
        CREATE INDEX idx_users_major
        ON users (major)
        `.execute(db);

    await sql`
        CREATE INDEX idx_users_year
        ON users (year)
        `.execute(db);

    await sql`
        CREATE INDEX idx_users_interests
        ON users (interests)
        `.execute(db);
}
