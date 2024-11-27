import { sql,type Kysely } from 'kysely';
import { DB } from '../dist/db';

export async function up(db: Kysely<DB>) {
    await sql`
        CREATE TABLE posts (
            id serial PRIMARY KEY,
            user_id integer NOT NULL REFERENCES users(id),
            UNIQUE(id, user_id),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            content text NOT NULL
        )
    `.execute(db);

    await sql`
        CREATE TABLE post_likes (
            id serial PRIMARY KEY,
            post_id integer NOT NULL REFERENCES posts(id),
            user_id integer NOT NULL REFERENCES users(id),
            UNIQUE(post_id, user_id)
        )
    `.execute(db);

    await sql`
        CREATE TABLE post_comments (
            id serial PRIMARY KEY,
            post_id integer NOT NULL REFERENCES posts(id),
            user_id integer NOT NULL REFERENCES users(id),
            UNIQUE(post_id, user_id),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            content text NOT NULL
        )
    `.execute(db);
}

export async function down(db: Kysely<DB>) {
    await sql`
        DROP TABLE post_comments;
        DROP TABLE post_likes;
        DROP TABLE posts;
    `.execute(db);

}
