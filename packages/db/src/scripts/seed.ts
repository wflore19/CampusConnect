import { type Transaction } from 'kysely';

import { db } from '../shared/db';
import { type DB } from '../shared/types';
import { migrate } from '../use-cases/migrate';
import { truncate } from '../use-cases/truncate';

async function main() {
    try {
        await migrate({ db });
        console.log('(1/3) Ran migrations and initialized tables. ✅');

        await db.transaction().execute(async (trx) => {
            await truncate(trx);
            await seed(trx);
        });

        console.log('(2/3) Wiped all data. ✅');
        console.log('(3/3) Seeded the database. ✅');
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await db.destroy();
    }
}

async function seed(trx: Transaction<DB>) {
    await trx.insertInto('events').values([]).execute();
}

main();
