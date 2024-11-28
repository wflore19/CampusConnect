import { sql, type Kysely } from 'kysely';
import { DB } from '../dist/db';

export async function up(db: Kysely<DB>) {
    await sql`
         ALTER TABLE users
         DROP COLUMN major,
         DROP COLUMN year,
         DROP COLUMN interests
      `.execute(db);
}

export async function down(db: Kysely<DB>) {
    await sql`
         ALTER TABLE users
         ADD COLUMN major TEXT NOT NULL DEFAULT '',
         ADD COLUMN year TEXT NOT NULL DEFAULT '',
         ADD COLUMN interests TEXT[] DEFAULT '{}'
      `.execute(db);
}
