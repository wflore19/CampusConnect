import { eq, desc, InferSelectModel } from 'drizzle-orm';
import { type User, db } from '@campusconnect/db';
import { posts, users } from '@campusconnect/db/schema';

export type Post = InferSelectModel<typeof posts>;
export type FeedPost = Partial<Post> & Partial<User>;

/**
 * Get all posts from user
 * @param id - The user ID
 * @returns {Promise<FeedPost[]>} - An array of posts with user information
 */
export async function getPostsByUserId(id: number) {
    const postsData: FeedPost[] = await db
        .select({
            id: posts.id,
            userId: posts.userId,
            createdAt: posts.createdAt,
            firstName: users.firstName,
            lastName: users.lastName,
            profilePicture: users.profilePicture,
            content: posts.content,
        })
        .from(posts)
        .leftJoin(users, eq(users.id, posts.userId))
        .where(eq(users.id, id))
        .orderBy(desc(posts.createdAt));

    return postsData;
}

/**
 * Get a post by ID
 * @param id - The post ID
 * @returns {Promise<FeedPost>} - The post with user information
 */
export async function getPostById(id: number) {
    const postsData: FeedPost[] = await db
        .select({
            id: posts.id,
            userId: posts.userId,
            createdAt: posts.createdAt,
            firstName: users.firstName,
            lastName: users.lastName,
            profilePicture: users.profilePicture,
            content: posts.content,
        })
        .from(posts)
        .leftJoin(users, eq(users.id, posts.userId))
        .where(eq(posts.id, id));

    return postsData[0];
}

/**
 * Create a post for a user
 * @param userId - The user ID
 * @param content - Text with line breaks, emojis, etc.
 */
export async function insertPost(userId: number, content: string) {
    await db.insert(posts).values({
        userId,
        content,
    });
}

/**
 * Update a post content
 * @param postId - The post ID
 * @param content - Text with line breaks, emojis, etc.
 */
export async function updatePost(postId: number, content: string) {
    await db
        .update(posts)
        .set({
            content,
        })
        .where(eq(posts.id, postId));
}

/**
 * Remove a post
 * @param postId - The post ID
 */
export async function deletePost(postId: number) {
    await db.delete(posts).where(eq(posts.id, postId));
}
