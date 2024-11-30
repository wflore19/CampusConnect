import { sql, type Kysely } from 'kysely';
import { DB } from '../../dist/db';

export async function up(db: Kysely<DB>) {
    await sql`
		CREATE TYPE user_details_sex AS ENUM ('male', 'female', 'other');
	`.execute(db);

    await sql`
		CREATE TYPE user_details_relationship_status AS ENUM ('single', 'taken', 'married', 'complicated');
	`.execute(db);

    await sql`
		CREATE TABLE user_details (
			id SERIAL PRIMARY KEY,
			user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
			UNIQUE (user_id),
			sex user_details_sex NULL,
			relationship_status user_details_relationship_status NULL,
			age INTEGER DEFAULT NULL,
			birthday VARCHAR(100) DEFAULT NULL,
			hometown VARCHAR(80) DEFAULT NULL,
			interests VARCHAR(100) DEFAULT NULL,
			favorite_music VARCHAR(100) DEFAULT NULL,
			favorite_movies VARCHAR(100) DEFAULT NULL,
			favorite_books VARCHAR(100) DEFAULT NULL,
			about_me VARCHAR(50) DEFAULT NULL,
			school VARCHAR(50) DEFAULT NULL,
			work VARCHAR(50) DEFAULT NULL
		);
	`.execute(db);
}

export async function down(db: Kysely<DB>) {
    await sql`
		DROP TABLE user_details
	`.execute(db);

    await sql`
		DROP TYPE user_details_sex
	`.execute(db);

    await sql`
		DROP TYPE user_details_relationship_status
	`.execute(db);
}
