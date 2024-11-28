import { sql, type Kysely } from 'kysely';
import { DB } from '../dist/db';

export async function up(db: Kysely<DB>) {
    await sql`
         DROP EXTENSION IF EXISTS "uuid-ossp"
      `.execute(db);
}

export async function down(db: Kysely<DB>) {
    await sql`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
   `.execute(db);
}
