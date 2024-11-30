import { sql, type Kysely } from 'kysely';
import { DB } from '../../dist/db';

export async function up(db: Kysely<DB>) {
    const users = await db.selectFrom('users').selectAll().execute();
    for (const user of users) {
        const [firstName, ...lastName] = user.name.split(' ');
        const lastNameStr = lastName.join(' ');

        await db
            .updateTable('users')
            .set({
                firstName: firstName,
                lastName: lastNameStr,
            })
            .where('id', '=', user.id)
            .execute();
    }
}

export async function down(db: Kysely<DB>) {
    // Undo everything in up function
    const users = await db.selectFrom('users').selectAll().execute();
    for (const user of users) {
        await sql`
            UPDATE users
            SET first_name = null, last_name = null
            WHERE id = ${user.id}
            `.execute(db);
    }
}
