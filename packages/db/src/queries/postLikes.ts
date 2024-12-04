import { InferSelectModel, and, eq } from 'drizzle-orm';
import { db } from '..';
import { postLikes } from '../schema/schema';

export type PostLikes = InferSelectModel<typeof postLikes>;

/**
 * Creates a new like on a post
 * @param userId - The ID of the user liking the post
 * @param postId - The ID of the post being liked
 */
export async function createPostLike(userId: number, postId: number) {
    await db.insert(postLikes).values({
        userId,
        postId,
    });
}

/**
 * Removes a like from a post
 * @param userId - The ID of the user unliking the post
 * @param postId - The ID of the post being unliked
 */
export async function deletePostLike(userId: number, postId: number) {
    await db
        .delete(postLikes)
        .where(and(eq(postLikes.userId, userId), eq(postLikes.postId, postId)));
}

/**
 * Gets all likes for a post
 * @param postId - The ID of the post to get likes for
 * @returns {Promise<PostLikes>} Array of post likes with user IDs
 */
export async function getPostLikes(postId: number) {
    const likes = await db
        .select()
        .from(postLikes)
        .where(eq(postLikes.postId, postId));

    return likes;
}

/**
 * Gets the number of likes on a post
 * @param postId
 * @returns {Promise<number>} - The number of likes on a post
 */
export async function getPostLikesCount(postId: number) {
    const likesCount = await db.$count(postLikes, eq(postLikes.postId, postId));

    return likesCount;
}

/**
 * Checks if a user has liked a specific post
 * @param userId - The ID of the user
 * @param postId - The ID of the post
 * @returns Boolean indicating if the user has liked the post
 */
export async function hasUserLikedPost(userId: number, postId: number) {
    const like = await db
        .select()
        .from(postLikes)
        .where(and(eq(postLikes.userId, userId), eq(postLikes.postId, postId)));

    return like.length > 0;
}
