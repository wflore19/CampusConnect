import { sql, type Kysely } from 'kysely';
import { DB } from '../dist/db';

export async function up(db: Kysely<DB>) {
    await sql`
        ALTER TABLE users
        ADD COLUMN first_name VARCHAR(255),
        ADD COLUMN last_name VARCHAR(255);
        `.execute(db);
}

export async function down(db: Kysely<DB>) {
    await sql`
        ALTER TABLE users
        DROP COLUMN first_name,
        DROP COLUMN last_name;
        `.execute(db);
}
