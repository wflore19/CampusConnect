import {
    pgTable,
    varchar,
    integer,
    timestamp,
    serial,
    date,
    text,
    unique,
    pgEnum,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const friendRequestStatus = pgEnum('friend_request_status', [
    'REQ_UID1',
    'REQ_UID2',
    'friend',
]);

export const userDetailsRelationshipStatus = pgEnum(
    'user_details_relationship_status',
    ['single', 'taken', 'married', 'complicated']
);

export const userDetailsSex = pgEnum('user_details_sex', [
    'male',
    'female',
    'other',
]);

export const kyselyMigrations = pgTable('kysely_migrations', {
    name: varchar({ length: 255 }).primaryKey().notNull(),
    timestamp: varchar({ length: 255 }).notNull(),
});

export const kyselyMigrationsLock = pgTable('kysely_migrations_lock', {
    id: varchar({ length: 255 }).primaryKey().notNull(),
    isLocked: integer('is_locked').default(0).notNull(),
});

export const users = pgTable('users', {
    createdAt: timestamp('created_at', {
        withTimezone: true,
        mode: 'string',
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', {
        withTimezone: true,
        mode: 'string',
    }).default(sql`CURRENT_TIMESTAMP`),
    id: serial().primaryKey().notNull(),
    firstName: varchar('first_name', { length: 255 }),
    lastName: varchar('last_name', { length: 255 }),
    email: varchar({ length: 255 }),
    profilePicture: varchar('profile_picture', { length: 255 }),
});

export const events = pgTable('events', {
    createdAt: timestamp('created_at', {
        withTimezone: true,
        mode: 'string',
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', {
        withTimezone: true,
        mode: 'string',
    }).default(sql`CURRENT_TIMESTAMP`),
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 255 }).default(''),
    date: date(),
    location: varchar({ length: 255 }).default(''),
    startTime: timestamp('start_time', {
        withTimezone: true,
        mode: 'string',
    }),
    endTime: timestamp('end_time', { withTimezone: true, mode: 'string' }),
    imageUrl: varchar('image_url', { length: 255 }),
    organizerId: integer('organizer_id').references(() => users.id),
    description: text().default(''),
});

export const userFriend = pgTable(
    'user_friend',
    {
        id: serial().primaryKey().notNull(),
        uid1: integer()
            .notNull()
            .references(() => users.id),
        uid2: integer()
            .notNull()
            .references(() => users.id),
        status: friendRequestStatus().notNull(),
    },
    (table) => [unique('user_friend_uid1_uid2_key').on(table.uid1, table.uid2)]
);

export const userDetails = pgTable('user_details', {
    id: serial().primaryKey().notNull(),
    userId: integer('user_id').references(() => users.id),
    sex: userDetailsSex(),
    relationshipStatus: userDetailsRelationshipStatus('relationship_status'),
    age: integer(),
    birthday: varchar({ length: 100 }).default(sql`NULL`),
    hometown: varchar({ length: 80 }).default(sql`NULL`),
    interests: varchar({ length: 100 }).default(sql`NULL`),
    favoriteMusic: varchar('favorite_music', { length: 100 }).default(
        sql`NULL`
    ),
    favoriteMovies: varchar('favorite_movies', { length: 100 }).default(
        sql`NULL`
    ),
    favoriteBooks: varchar('favorite_books', { length: 100 }).default(
        sql`NULL`
    ),
    aboutMe: varchar('about_me', { length: 50 }).default(sql`NULL`),
    school: varchar({ length: 50 }).default(sql`NULL`),
    work: varchar({ length: 50 }).default(sql`NULL`),
});

export const posts = pgTable(
    'posts',
    {
        id: serial().primaryKey().notNull(),
        userId: integer('user_id')
            .notNull()
            .references(() => users.id),
        createdAt: timestamp('created_at', {
            withTimezone: true,
            mode: 'string',
        }).default(sql`CURRENT_TIMESTAMP`),
        content: text().notNull(),
    },
    (table) => [unique('posts_id_user_id_key').on(table.id, table.userId)]
);

export const postLikes = pgTable(
    'post_likes',
    {
        id: serial().primaryKey().notNull(),
        postId: integer('post_id')
            .notNull()
            .references(() => posts.id),
        userId: integer('user_id')
            .notNull()
            .references(() => users.id),
    },
    (table) => [
        unique('post_likes_post_id_user_id_key').on(table.postId, table.userId),
    ]
);

export const postComments = pgTable(
    'post_comments',
    {
        id: serial().primaryKey().notNull(),
        postId: integer('post_id')
            .notNull()
            .references(() => posts.id),
        userId: integer('user_id')
            .notNull()
            .references(() => users.id),
        createdAt: timestamp('created_at', {
            withTimezone: true,
            mode: 'string',
        }).default(sql`CURRENT_TIMESTAMP`),
        content: text().notNull(),
    },
    (table) => [
        unique('post_comments_id_user_id_key').on(table.id, table.userId),
    ]
);
