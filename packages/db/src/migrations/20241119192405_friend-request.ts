import { sql, type Kysely } from 'kysely';
import { DB } from '../../dist/db';

export async function up(db: Kysely<DB>) {
    await sql`
      CREATE TYPE friend_request_status AS ENUM ('REQ_UID1', 'REQ_UID2', 'friend')
      `.execute(db);

    await sql`
      CREATE TABLE user_friend (
         id SERIAL PRIMARY KEY,
         uid1 INT NOT NULL REFERENCES users(id),
         uid2 INT NOT NULL REFERENCES users(id),
         status friend_request_status NOT NULL,
         UNIQUE (uid1, uid2),
         UNIQUE (uid2, uid1)
      )`.execute(db);
}

export async function down(db: Kysely<DB>) {
    await sql`
  DROP TABLE user_friend
  `.execute(db);

    await sql`
       DROP TYPE friend_request_status
       `.execute(db);
}
