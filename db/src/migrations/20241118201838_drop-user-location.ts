import { sql, type Kysely } from 'kysely';
import { DB } from '../dist/db';

export async function up(db: Kysely<DB>) {
    await db.schema.alterTable('users').dropColumn('location').execute();
}

export async function down(db: Kysely<DB>) {
    await sql`
         ALTER TABLE users
         ADD COLUMN location TEXT
      `.execute(db);
}
