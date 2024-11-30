import { sql, type Kysely } from 'kysely';
import { DB } from '../../dist/db';

export async function up(db: Kysely<DB>) {
    await sql`
        ALTER TABLE users
        DROP COLUMN name
        `.execute(db);
}

export async function down(db: Kysely<DB>) {
    await sql`
        ALTER TABLE users
        ADD COLUMN name TEXT NOT NULL DEFAULT ''
    `.execute(db);

    const users = await db.selectFrom('users').selectAll().execute();
    for (let i = 0; i < users.length; i++) {
        await sql`
            UPDATE users
            SET name = ${users[i].firstName + ' ' + users[i].lastName}
            WHERE id = ${users[i].id}
            `.execute(db);
    }
}
