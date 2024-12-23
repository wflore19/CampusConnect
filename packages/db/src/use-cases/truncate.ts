import { sql, type Transaction } from 'kysely';

import { IS_PRODUCTION } from '../shared/env';
import { type DB } from '../shared/types';

/**
 * Truncates all tables in the database - wiping all rows, but does not affect
 * the schema itself. This can only be used in development/test environments.
 *
 * @see https://www.postgresql.org/docs/current/sql-truncate.html
 */
export async function truncate(trx: Transaction<DB>) {
    if (IS_PRODUCTION) {
        return;
    }

    const tables = await trx.introspection.getTables();

    const names = tables
        .filter((table) => {
            // We don't want to wipe the kysely tables, which track migrations b/c
            // migrations should only be run once.
            return !table.name.includes('kysely_');
        })
        .map((table) => {
            return table.name;
        })
        .join(', ');

    await sql`truncate table ${sql.raw(names)} cascade;`.execute(trx);
}
