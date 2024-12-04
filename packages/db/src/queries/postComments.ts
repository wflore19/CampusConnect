import { eq } from 'drizzle-orm';
import { db } from '..';
import { postComments } from '../schema/schema';

/**
 * Creates a new comment on a post
 * @param userId - The ID of the user creating the comment
 * @param postId - The ID of the post being commented on
 * @param content - The content of the comment
 */
export async function createPostComment(
    userId: number,
    postId: number,
    content: string
) {
    await db.insert(postComments).values({
        userId,
        postId,
        content,
    });
}

/**
 * Deletes a comment from a post
 * @param id - The ID of the comment to delete
 */
export async function deletePostComment(id: number) {
    await db.delete(postComments).where(eq(postComments.id, id));
}

/**
 * Gets all comments for a specific post
 * @param postId - The ID of the post to get comments for
 * @returns Array of comments with user IDs and content
 */
export async function getPostComments(postId: number) {
    const comments = await db
        .select()
        .from(postComments)
        .where(eq(postComments.postId, postId))
        .orderBy(postComments.createdAt);

    return comments;
}

/**
 * Gets a specific comment by ID
 * @param commentId - The ID of the comment to retrieve
 * @returns The comment data or throws if not found
 */
export async function getPostCommentById(commentId: number) {
    const comment = await db
        .select()
        .from(postComments)
        .where(eq(postComments.id, commentId));

    if (!comment.length) throw new Error('Comment not found');

    return comment[0];
}
