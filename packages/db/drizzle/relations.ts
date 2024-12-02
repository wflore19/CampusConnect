import { relations } from 'drizzle-orm/relations';
import {
    users,
    events,
    userFriend,
    userDetails,
    posts,
    postLikes,
    postComments,
} from '../src/schema/schema';

export const eventsRelations = relations(events, ({ one }) => ({
    user: one(users, {
        fields: [events.organizerId],
        references: [users.id],
    }),
}));

export const usersRelations = relations(users, ({ many }) => ({
    events: many(events),
    userFriends_uid1: many(userFriend, {
        relationName: 'userFriend_uid1_users_id',
    }),
    userFriends_uid2: many(userFriend, {
        relationName: 'userFriend_uid2_users_id',
    }),
    userDetails: many(userDetails),
    posts: many(posts),
    postLikes: many(postLikes),
    postComments: many(postComments),
}));

export const userFriendRelations = relations(userFriend, ({ one }) => ({
    user_uid1: one(users, {
        fields: [userFriend.uid1],
        references: [users.id],
        relationName: 'userFriend_uid1_users_id',
    }),
    user_uid2: one(users, {
        fields: [userFriend.uid2],
        references: [users.id],
        relationName: 'userFriend_uid2_users_id',
    }),
}));

export const userDetailsRelations = relations(userDetails, ({ one }) => ({
    user: one(users, {
        fields: [userDetails.userId],
        references: [users.id],
    }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
    user: one(users, {
        fields: [posts.userId],
        references: [users.id],
    }),
    postLikes: many(postLikes),
    postComments: many(postComments),
}));

export const postLikesRelations = relations(postLikes, ({ one }) => ({
    post: one(posts, {
        fields: [postLikes.postId],
        references: [posts.id],
    }),
    user: one(users, {
        fields: [postLikes.userId],
        references: [users.id],
    }),
}));

export const postCommentsRelations = relations(postComments, ({ one }) => ({
    post: one(posts, {
        fields: [postComments.postId],
        references: [posts.id],
    }),
    user: one(users, {
        fields: [postComments.userId],
        references: [users.id],
    }),
}));
