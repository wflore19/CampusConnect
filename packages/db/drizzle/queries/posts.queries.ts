import { eq, desc, InferSelectModel } from 'drizzle-orm';
import { db } from '@campusconnect/db';
import { posts, users } from '@campusconnect/db/schema';

/**
 * Get all posts from friends
 * @param id
 * @returns {Promise<Array>} - An array of posts
 *
 * @example
 * const posts = await getPosts(1);
 */
export async function getPostsById(id: number) {
    const postsData = await db
        .select({
            firstName: users.firstName,
            lastName: users.lastName,
            profilePicture: users.profilePicture,
            id: posts.id,
            createdAt: posts.createdAt,
            userId: posts.userId,
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
 * @param id
 * @returns {Promise<Object>} - The post object
 * @throws {Error} - If the post is not found
 *
 * @example
 * const post = await getPostById(1);
 */
export async function getPostById(id: number) {
    const postData = await db
        .select({
            id: posts.id,
            createdAt: posts.createdAt,
            userId: posts.userId,
            content: posts.content,
        })
        .from(posts)
        .where(eq(posts.id, id));

    if (!postData) throw new Error('Post not found');

    return postData[0];
}

/**
 * Create a post
 * @param userId
 * @param content
 * @returns
 *
 * @example
 * const post = await createPost(1, 'Hello', 'This is a post');
 */
export async function createPost(userId: number, content: string) {
    const postData = await db.insert(posts).values({
        userId,
        content,
    });

    return postData;
}

/**
 * Update a post
 * @param postId
 * @param content
 * @returns
 *
 * @example
 * const post = await updatePost(1, 'This is a post');
 */
export async function updatePost(postId: number, content: string) {
    const postData = await db
        .update(posts)
        .set({
            content,
        })
        .where(eq(posts.id, postId));

    return postData;
}

/**
 * Delete a post
 * @param postId
 * @returns
 *
 * @example
 * const post = await deletePost(1);
 */
export async function deletePost(postId: number) {
    const postData = await db.delete(posts).where(eq(posts.id, postId));

    return postData;
}

export type Post = InferSelectModel<typeof posts>;
