import {
    pgTable,
    varchar,
    integer,
    timestamp,
    serial,
    primaryKey,
    text,
    unique,
    pgEnum,
    check,
} from 'drizzle-orm/pg-core';
import { lt, sql } from 'drizzle-orm';
import { enumToPgEnum } from '../utils/enum';

export enum FriendshipStatus {
    REQ_UID1 = 'REQ_UID1',
    REQ_UID2 = 'REQ_UID2',
    FRIEND = 'friend',
}
export const friendRequestStatus = pgEnum(
    'friend_request_status',
    enumToPgEnum(FriendshipStatus)
);

export enum RelationshipStatus {
    SINGLE = 'single',
    TAKEN = 'taken',
    MARRIED = 'married',
    COMPLICATED = 'complicated',
}
export const userDetailsRelationshipStatus = pgEnum(
    'user_details_relationship_status',
    enumToPgEnum(RelationshipStatus)
);

export enum SexEnum {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}
export const userDetailsSex = pgEnum('sex', enumToPgEnum(SexEnum));

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
    id: serial().primaryKey().notNull(),
    firstName: varchar('first_name', { length: 255 }),
    lastName: varchar('last_name', { length: 255 }),
    email: varchar({ length: 255 }),
    profilePicture: varchar('profile_picture', { length: 255 }),
    backupProfilePicture: varchar('backup_profile_picture', { length: 255 }),
});

export const friendships = pgTable(
    'friendships',
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
    (table) => [
        check('uid1_is_less_than_uid2', lt(table.uid1, table.uid2)),
        unique('user_friend_uid1_uid2_key').on(table.uid1, table.uid2),
    ]
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
